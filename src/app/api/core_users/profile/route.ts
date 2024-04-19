import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/drizzle/db';
import { DistrictTable, LocalTable, UserTable } from '@/drizzle/schema';
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
  const users = await db
    .select({
      id: UserTable.id,
      name: UserTable.name,
      email: UserTable.email,
      district: DistrictTable,
    })
    .from(UserTable)
    .where(eq(UserTable.email, authUser.email!))
    .leftJoin(DistrictTable, eq(UserTable.district_id, DistrictTable.id));
  if (users.length !== 1) return unauthorizedResponse;
  /* -------------------------------------------------------------------------- */

  const user = { ...users[0], picture: authUser.user_metadata.picture };

  return NextResponse.json(user);
};
