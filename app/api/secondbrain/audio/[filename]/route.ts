import { NextResponse } from 'next/server';
import { getPcTunnelBase } from '../../pcTunnel';
import fs from 'fs';
import path from 'path';
import { downloadAudioFromCloudRepo } from '@/app/secondbrain/cloudStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const rawName = decodeURIComponent(params.filename || '');
    const safeName = path.basename(rawName);
    const localPath = path.join(process.cwd(), 'public', 'recordings', safeName);
    const tmpPath = path.join('/tmp', 'recordings', safeName);

    let fileBuffer: Buffer | null = null;

    if (fs.existsSync(localPath)) {
      fileBuffer = fs.readFileSync(localPath);
    } else if (fs.existsSync(tmpPath)) {
      fileBuffer = fs.readFileSync(tmpPath);
    } else {
      fileBuffer = await downloadAudioFromCloudRepo(safeName);
      if (!fileBuffer && request.headers.get('x-from-vercel-proxy') !== '1') {
        try {
          const headers: Record<string, string> = { 'x-from-vercel-proxy': '1' };
          const range = request.headers.get('range');
          if (range) headers.Range = range;
          const tunnelRes = await fetch(
            `${(await getPcTunnelBase()) || 'https://invalid.local'}/api/secondbrain/audio/${encodeURIComponent(
              safeName
            )}`,
            { headers, cache: 'no-store' }
          );
          if (tunnelRes.ok) {
            const proxyHeaders = new Headers();
            for (const name of ['content-type', 'content-length', 'content-range', 'accept-ranges', 'cache-control']) {
              const value = tunnelRes.headers.get(name);
              if (value) proxyHeaders.set(name, value);
            }
            proxyHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
            return new NextResponse(tunnelRes.body, {
              status: tunnelRes.status,
              headers: proxyHeaders,
            });
          }
        } catch {}
      }
      if (fileBuffer) {
        try {
          fs.mkdirSync(path.dirname(tmpPath), { recursive: true });
          fs.writeFileSync(tmpPath, fileBuffer);
        } catch {}
      }
    }

    if (!fileBuffer) {
      return new NextResponse('Audio file not found', { status: 404 });
    }

    const fileSize = fileBuffer.length;
    const { searchParams } = new URL(request.url);
    const isDownload = searchParams.get('download') === '1';

    const contentType = safeName.endsWith('.mp3')
      ? 'audio/mpeg'
      : safeName.endsWith('.m4a') || safeName.endsWith('.mp4')
      ? 'audio/mp4'
      : safeName.endsWith('.ogg')
      ? 'audio/ogg'
      : 'audio/wav';

    const baseHeaders: Record<string, string> = {
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    };

    if (isDownload) {
      baseHeaders['Content-Disposition'] = `attachment; filename="${encodeURIComponent(safeName)}"`;
    }

    const range = request.headers.get('range');
    if (range && !isDownload) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;

      const sliced = fileBuffer.subarray(start, end + 1);

      return new NextResponse(new Uint8Array(sliced), {
        status: 206,
        headers: {
          ...baseHeaders,
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Content-Length': String(chunksize),
        },
      });
    }

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        ...baseHeaders,
        'Content-Length': String(fileSize),
      },
    });
  } catch (err: any) {
    return new NextResponse(`Audio error: ${err.message}`, { status: 500 });
  }
}
