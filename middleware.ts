import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // When accessing via weddinghelper.love, serve WeddingHelper at root '/'
  if (host.includes('weddinghelper') && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/weddinghelper';
    return NextResponse.rewrite(url);
  }

  // When accessing via thestayhelper.com or any stayhelper domain, serve StayHelper at root '/'
  if ((host.includes('thestayhelper') || host.includes('stayhelper')) && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/stayhelper';
    return NextResponse.rewrite(url);
  }

  // When accessing via stylinghelper.com, serve StylingHelper at root '/'
  if (host.includes('stylinghelper') && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/stylinghelper';
    return NextResponse.rewrite(url);
  }

  // When accessing /stylinghelper via personalcolorhelper.com, redirect directly to official stylinghelper.com
  if (host.includes('personalcolorhelper') && pathname.startsWith('/stylinghelper')) {
    return NextResponse.redirect('https://stylinghelper.com', 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|videos|stays).*)'],
};
