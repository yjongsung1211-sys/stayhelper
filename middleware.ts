import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // 0. Antigravity & NoteHelper 24/7 Cloud Hub: Always allow /antigravity, /hana, /notehelper, /secondbrain, /schedulehelper on any domain
  if (
    pathname.startsWith('/antigravity') ||
    pathname.startsWith('/hana') ||
    pathname.startsWith('/notehelper') ||
    pathname.startsWith('/secondbrain') ||
    pathname.startsWith('/schedulehelper')
  ) {
    return NextResponse.next();
  }
  if (host.includes('secondbrain') && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/secondbrain';
    return NextResponse.rewrite(url);
  }
  if (host.includes('notehelper') && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/notehelper';
    return NextResponse.rewrite(url);
  }

  // 1. WeddingHelper (ACTIVE PRODUCTION SERVICE)
  if (host.includes('weddinghelper')) {
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = '/weddinghelper';
      return NextResponse.rewrite(url);
    }
    if (pathname === '/gallery') {
      const url = request.nextUrl.clone();
      url.pathname = '/weddinghelper/gallery';
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 2. StayHelper (ACTIVE PRODUCTION SERVICE)
  if ((host.includes('thestayhelper') || host.includes('stayhelper')) && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/stayhelper';
    return NextResponse.rewrite(url);
  }

  // 3. StylingHelper (ACTIVE PRODUCTION SERVICE)
  if (host.includes('stylinghelper')) {
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = '/stylinghelper';
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 4. PersonalColorHelper (ACTIVE PRODUCTION SERVICE)
  if (host.includes('personalcolorhelper')) {
    if (pathname === '/personalcolorhelper' || pathname === '/colorhelper') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url, 301);
    }
    return NextResponse.next();
  }

  // 5. RoomHelper
  if (host.includes('roomhelper') && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/roomhelper';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|notehelper-192.png|notehelper-512.png|schedulehelper-192.png|schedulehelper-512.png|antigravity-192.png|antigravity-512.png|antigravity-hana.apk|notehelper.apk|schedulehelper.apk|antigravity-manifest.json|manifest-schedulehelper.json|secondbrain-manifest.json|secondbrain-sw.js|images|videos|stays).*)',
  ],
};
