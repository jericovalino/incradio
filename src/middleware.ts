import { createClient } from '@/utils/supabase/middleware';
import { NextRequest, NextResponse } from 'next/server';

const getClientIP = (requestHeaders: NextRequest['headers']) => {
  const FALLBACK_IP_ADDRESS = '0.0.0.0';
  const forwardedFor = requestHeaders.get('x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0] ?? FALLBACK_IP_ADDRESS;
  }

  return requestHeaders.get('x-real-ip') ?? FALLBACK_IP_ADDRESS;
};

export const middleware = async (request: NextRequest) => {
  const { pathname } = new URL(request.url);

  /* -------------------------------------------------------------------------- */
  const client = createClient(request);
  const userData = await client.supabase.auth.getUser();
  const user = userData.data.user;
  /* -------------------------------------------------------------------------- */

  // console.log('pathname: ', pathname);
  // console.log('withUser: ', !!user);

  if (!user) {
    if (pathname.startsWith('/core'))
      return NextResponse.redirect(
        new URL('/login', request.nextUrl.origin).toString()
      );
    console.log('if: next');
    return NextResponse.next();
  }

  switch (pathname) {
    case '/':
      console.log('middleware: in "/"');
      return NextResponse.redirect(
        new URL('/core/dashboard', request.nextUrl.origin).toString()
      );
    case '/core':
      console.log('middleware: in "/core"');
      return NextResponse.redirect(
        new URL('/core/dashboard', request.nextUrl.origin).toString()
      );
    case '/login':
      console.log('middleware: in "/login"');
      return NextResponse.redirect(
        new URL('/core', request.nextUrl.origin).toString()
      );
    default:
      console.log('switch: next');
      return NextResponse.next();
  }
};

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },

    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      has: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },

    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      has: [{ type: 'header', key: 'x-present' }],
      missing: [{ type: 'header', key: 'x-missing', value: 'prefetch' }],
    },
  ],
};
