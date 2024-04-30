import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/drizzle/db';
import { createClient } from '@/utils/supabase/middleware';

const unauthorizedResponse = NextResponse.json(
  {
    message: 'unauthorized',
  },
  {
    status: 401,
    statusText: 'unauthorized',
  }
);

export const GET = async (req: NextRequest) => {
  const client = createClient(req);

  /* -------------------------------------------------------------------------- */
  const authUser = await client.supabase.auth
    .getUser()
    .then((userData) => userData.data.user);
  if (!authUser) return unauthorizedResponse;
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  try {
    const user = await db.query.UserTable.findFirst({
      where: (tableRow, methods) => methods.eq(tableRow.email, authUser.email!),
      with: {
        district: true,
      },
    });
    if (!user) return unauthorizedResponse;
    /* -------------------------------------------------------------------------- */

    return NextResponse.json({
      ...user,
      picture: authUser.user_metadata.picture,
    });
  } catch (error) {
    console.log('error: ', error);
    return unauthorizedResponse;
  }
};
