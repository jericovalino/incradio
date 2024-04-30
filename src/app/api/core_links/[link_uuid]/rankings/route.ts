import { db } from '@/drizzle/db';
import { and, count, desc, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/middleware';
import { ClickTable, LocalTable } from '@/drizzle/schema';

const unauthorizedResponse = NextResponse.json(
  {
    message: 'unauthorized',
  },
  {
    status: 401,
    statusText: 'unauthorized',
  }
);

const notfoundResponse = NextResponse.json(
  {
    message: 'not found',
  },
  {
    status: 404,
    statusText: 'not found',
  }
);

type Params = {
  link_uuid: string;
};
export const GET = async (req: NextRequest, { params }: { params: Params }) => {
  const client = createClient(req);

  /* -------------------------------------------------------------------------- */
  const authUser = await client.supabase.auth
    .getUser()
    .then((userData) => userData.data.user);
  if (!authUser) return unauthorizedResponse;
  /* -------------------------------------------------------------------------- */
  const user = await db.query.UserTable.findFirst({
    where: (fields, operators) => operators.eq(fields.email, authUser.email!),
  });
  if (!user) return unauthorizedResponse;
  /* -------------------------------------------------------------------------- */
  const link = await db.query.LinkTable.findFirst({
    where: (fields, operators) => operators.eq(fields.id, params.link_uuid),
  });
  if (!link) return notfoundResponse;
  /* -------------------------------------------------------------------------- */

  const rankings = await db
    .select({
      local_name: LocalTable.name,
      local_code: LocalTable.code,
      click_count: count(ClickTable.local_code),
    })
    .from(ClickTable)
    .rightJoin(
      LocalTable,
      and(
        eq(ClickTable.link_code, link.code),
        eq(ClickTable.local_code, LocalTable.code)
      )
    )
    .groupBy(LocalTable.name, LocalTable.code, ClickTable.local_code)
    .orderBy(desc(count(ClickTable.local_code)))
    .limit(5);

  return NextResponse.json(rankings);
};
