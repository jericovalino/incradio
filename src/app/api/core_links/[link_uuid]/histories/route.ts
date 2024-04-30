import { db } from '@/drizzle/db';
import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/middleware';
import { ClickTable, LocalTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

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
  const link = await db.query.LinkTable.findFirst({
    where: (fields, operators) => operators.eq(fields.id, params.link_uuid),
  });
  if (!link) return notfoundResponse;
  /* -------------------------------------------------------------------------- */

  const clicks = await db
    .select({
      created_at: ClickTable.created_at,
      local_name: LocalTable.name,
    })
    .from(ClickTable)
    .where(eq(ClickTable.link_code, link.code))
    .leftJoin(LocalTable, eq(LocalTable.code, ClickTable.local_code));
  return NextResponse.json(clicks);
};
