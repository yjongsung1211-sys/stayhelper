import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // 0. NoteHelper (노트헬퍼) 24/7 Cloud Hub: Always allow /notehelper and /secondbrain on any domain
  if (pathname.startsWith('/notehelper') || pathname.startsWith('/secondbrain')) {
    return NextResponse.next();
  }
  if ((host.includes('notehelper') || host.includes('secondbrain')) && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/notehelper';
    return NextResponse.rewrite(url);
  }

  // 1. WeddingHelper (Temporarily Paused): Rewrite all routes to /weddinghelper coming soon (except /invite)
  if (host.includes('weddinghelper')) {
    if (!pathname.startsWith('/invite')) {
      const url = request.nextUrl.clone();
      url.pathname = '/weddinghelper';
      return NextResponse.rewrite(url);
    }
  }

  // 2. StayHelper (ACTIVE SERVICE): Serve StayHelper live experience at root '/'
  if ((host.includes('thestayhelper') || host.includes('stayhelper')) && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/stayhelper';
    return NextResponse.rewrite(url);
  }

  // 3. StylingHelper (Temporarily Paused): Rewrite all routes to /stylinghelper coming soon
  if (host.includes('stylinghelper')) {
    const url = request.nextUrl.clone();
    url.pathname = '/stylinghelper';
    return NextResponse.rewrite(url);
  }

  // 4. PersonalColorHelper (ACTIVE LIVE SERVICE): Serve PersonalColorHelper directly at root '/'
  if (host.includes('personalcolorhelper')) {
    if (pathname === '/personalcolorhelper' || pathname === '/colorhelper') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url, 301);
    }
  }

  // 5. RoomHelper (Temporarily Paused): Rewrite to /roomhelper coming soon
  if (host.includes('roomhelper')) {
    const url = request.nextUrl.clone();
    url.pathname = '/roomhelper';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|videos|stays).*)'],
};
