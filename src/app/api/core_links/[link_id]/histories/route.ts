import { db } from '@/drizzle/db';
import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/middleware';
import { ClickTable, LocaleTable } from '@/drizzle/schema';
import { and, desc, eq } from 'drizzle-orm';

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
  link_id: string;
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
    where: (fields, operators) => operators.eq(fields.id, params.link_id),
  });
  if (!link) return notfoundResponse;
  /* -------------------------------------------------------------------------- */

  const clicks = await db
    .select({
      created_at: ClickTable.created_at,
      locale_name: LocaleTable.name,
      ip: ClickTable.ip,
    })
    .from(ClickTable)
    .leftJoin(
      LocaleTable,
      and(
        eq(ClickTable.is_bot, false),
        eq(ClickTable.locale_code, LocaleTable.code)
      )
    )
    .where(
      and(
        eq(ClickTable.link_code, link.code),
        eq(LocaleTable.district_id, user.district_id)
      )
    )
    .orderBy(desc(ClickTable.created_at));
  return NextResponse.json(clicks);
};
