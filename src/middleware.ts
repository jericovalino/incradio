import { createClient } from '@/utils/supabase/middleware';
import { NextRequest, NextResponse } from 'next/server';

export const middleware = async (request: NextRequest) => {
  const { pathname, searchParams } = new URL(request.url);

  /* -------------------------------------------------------------------------- */
  const client = createClient(request);
  const userData = await client.supabase.auth.getUser();
  // console.log('userData: ', userData);
  const user = userData.data.user;
  /* -------------------------------------------------------------------------- */

  console.log('user: ', user);

  switch (pathname) {
    case '/core':
      console.log('middleware: in "/core"');
      if (user)
        return NextResponse.redirect(
          new URL('/core/dashboard', request.nextUrl.origin).toString()
        );
      return NextResponse.redirect(
        new URL('/login', request.nextUrl.origin).toString()
      );

    case '/login':
      console.log('middleware: in "/login"');
      if (user)
        return NextResponse.redirect(
          new URL('/core', request.nextUrl.origin).toString()
        );
      return NextResponse.next();
    default:
      return NextResponse.next();
  }
};

export const config = {
  matcher: ['/', '/login', '/core'],
};
