import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // When accessing via thestayhelper.com or any stayhelper domain, serve StayHelper at root '/'
  if ((host.includes('thestayhelper') || host.includes('stayhelper')) && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/stayhelper';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|videos|stays).*)'],
};
