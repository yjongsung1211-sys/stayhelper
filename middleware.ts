import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // When accessing via weddinghelper.love, serve WeddingHelper Coming Soon at all pages (except /invite if guest viewed)
  if (host.includes('weddinghelper')) {
    if (!pathname.startsWith('/invite')) {
      const url = request.nextUrl.clone();
      url.pathname = '/weddinghelper';
      return NextResponse.rewrite(url);
    }
  }

  // When accessing via thestayhelper.com or stayhelper
  if (host.includes('thestayhelper') || host.includes('stayhelper')) {
    const url = request.nextUrl.clone();
    url.pathname = '/stayhelper';
    return NextResponse.rewrite(url);
  }

  // When accessing via roomhelper
  if (host.includes('roomhelper')) {
    const url = request.nextUrl.clone();
    url.pathname = '/roomhelper';
    return NextResponse.rewrite(url);
  }

  // When accessing via stylinghelper.com
  if (host.includes('stylinghelper')) {
    const url = request.nextUrl.clone();
    url.pathname = '/stylinghelper';
    return NextResponse.rewrite(url);
  }

  // When accessing via personalcolorhelper.com
  if (host.includes('personalcolorhelper')) {
    if (pathname !== '/') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|videos|stays).*)'],
};
