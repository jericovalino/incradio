import { db } from '@/drizzle/db';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { LinkTable } from '@/drizzle/schema';
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

const notfoundResponse = NextResponse.json(
  {
    message: 'not found',
  },
  {
    status: 404,
    statusText: 'not found',
  }
);

const internalServerErrorResponse = NextResponse.json(
  {
    message: 'internal server error',
  },
  {
    status: 500,
    statusText: 'internal server error',
  }
);

type Params = {
  link_id: string;
};
export const DELETE = async (
  req: NextRequest,
  { params }: { params: Params }
) => {
  const client = createClient(req);
  const { link_id } = params;

  /* -------------------------------------------------------------------------- */
  const authUser = await client.supabase.auth
    .getUser()
    .then((userData) => userData.data.user);
  if (!authUser) return unauthorizedResponse;
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  const user = await db.query.UserTable.findFirst({
    where: (fields, operators) => operators.eq(fields.email, authUser.email!),
  });
  if (!user) return unauthorizedResponse;
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  const link = await db.query.LinkTable.findFirst({
    where: (fields, operators) => operators.eq(fields.id, params.link_id),
  });
  if (!link) return notfoundResponse;
  if (link.district_id !== user.district_id) return unauthorizedResponse;
  /* -------------------------------------------------------------------------- */

  try {
    const newlyUpdatedLinks = await db
      .update(LinkTable)
      .set({
        status: 'ARCHIVED',
      })
      .where(eq(LinkTable.id, link_id))
      .returning();
    return NextResponse.json(newlyUpdatedLinks[0]);
  } catch (err) {
    return internalServerErrorResponse;
  }
};
