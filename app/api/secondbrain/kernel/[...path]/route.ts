import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * 브라우저 ↔ 로컬 SecondBrain Sync Kernel(127.0.0.1:8787) 프록시.
 *
 * 커널은 볼트 전문(기밀 트랙 포함)을 내주므로 접근을 좁힌다:
 *  - 같은 PC(loopback)·사설망(LAN)에서 온 요청은 허용
 *  - 터널/프록시를 거친 외부 요청은 SBK_PROXY_KEY 가 설정돼 있고 x-sbk-key 헤더가 일치할 때만 허용
 */
const KERNEL_URL = (process.env.SBK_URL || 'http://127.0.0.1:8787').replace(/\/$/, '');
const ALLOWED = new Set(['health', 'sync/pull', 'sync/push', 'capture', 'snapshot', 'doc', 'search', 'graph']);

function isPrivateHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    /^10\./.test(hostname) ||
    /^192\.168\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
  );
}

function authorize(req: NextRequest): boolean {
  const key = process.env.SBK_PROXY_KEY || '';
  if (key && req.headers.get('x-sbk-key') === key) return true;
  if (req.headers.has('cf-connecting-ip') || req.headers.has('cf-ray') || req.headers.has('x-vercel-id')) {
    return false; // Cloudflare 터널·Vercel 을 거친 외부 요청
  }
  // Next 는 로컬 요청에도 x-forwarded-for 를 붙인다 — 값(실제 접속 IP)이 loopback/사설망인지로 판단한다
  const client = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim().replace(/^::ffff:/, '');
  if (client && client !== '::1' && !isPrivateHost(client)) return false;
  const host = (req.headers.get('host') || '').replace(/:\d+$/, '');
  return isPrivateHost(host);
}

async function forward(req: NextRequest, segments: string[]): Promise<NextResponse> {
  const route = segments.join('/');
  if (!ALLOWED.has(route)) {
    return NextResponse.json({ ok: false, error: 'unknown kernel route' }, { status: 404 });
  }
  if (!authorize(req)) {
    return NextResponse.json({ ok: false, error: 'kernel proxy: forbidden' }, { status: 403 });
  }
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (process.env.SBK_TOKEN) headers['X-SBK-Token'] = process.env.SBK_TOKEN;
  let body: string | undefined;
  if (req.method === 'POST') {
    body = await req.text();
    headers['Content-Type'] = 'application/json';
  }
  try {
    const res = await fetch(`${KERNEL_URL}/${route}${req.nextUrl.search}`, {
      method: req.method,
      headers,
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  } catch {
    // 커널 미가동 — 클라이언트 엔진은 이를 '오프라인'으로 보고 큐를 유지한다
    return NextResponse.json({ ok: false, error: 'kernel_unreachable' }, { status: 503 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(req, params.path);
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return forward(req, params.path);
}
