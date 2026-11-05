import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    // Sanitize filename to prevent directory traversal
    const safeFilename = path.basename(filename);
    const filePath = path.resolve(process.cwd(), 'public/images/tryon', safeFilename);

    if (!fs.existsSync(filePath)) {
      return new NextResponse('Image not found', { status: 404 });
    }

    const imageBuffer = fs.readFileSync(filePath);
    const ext = path.extname(safeFilename).toLowerCase();
    const contentType =
      ext === '.jpg' || ext === '.jpeg'
        ? 'image/jpeg'
        : ext === '.webp'
        ? 'image/webp'
        : 'image/png';

    const isDownload = req.nextUrl.searchParams.get('download') === '1';

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
        'Content-Disposition': isDownload
          ? `attachment; filename="${safeFilename}"`
          : `inline; filename="${safeFilename}"`
      }
    });
  } catch (error: any) {
    return new NextResponse('Internal error', { status: 500 });
  }
}
