import dayjs from 'dayjs';
import { NextRequest, NextResponse } from 'next/server';
import { and, count, desc, eq, gte, lte } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { createClient } from '@/utils/supabase/middleware';
import { ClickTable, LocaleTable } from '@/drizzle/schema';

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
  from?: string;
  to?: string;
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

  const rankings = await db
    .select({
      locale_name: LocaleTable.name,
      locale_code: LocaleTable.code,
      click_count: count(ClickTable.locale_code),
    })
    .from(ClickTable)
    .rightJoin(
      LocaleTable,
      and(
        eq(ClickTable.is_bot, false),
        eq(ClickTable.link_code, link.code),
        eq(ClickTable.locale_code, LocaleTable.code),
        params.from
          ? gte(
              ClickTable.created_at,
              dayjs(params.from, { locale: 'tl-ph' }).utc().toDate()
            )
          : undefined,
        params.to
          ? lte(
              ClickTable.created_at,
              dayjs(params.to, { locale: 'tl-ph' }).utc().toDate()
            )
          : undefined
      )
    )
    .groupBy(LocaleTable.name, LocaleTable.code, ClickTable.locale_code)
    .orderBy(desc(count(ClickTable.locale_code)))
    .where(eq(LocaleTable.district_id, link.district_id))
    .limit(5);

  return NextResponse.json(rankings);
};
