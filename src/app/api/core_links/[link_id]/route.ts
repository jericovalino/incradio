import { eq } from 'drizzle-orm';
import { db } from '@/drizzle/db';
import { NextRequest, NextResponse } from 'next/server';

import { LinkTable } from '@/drizzle/schema';
import { createClient } from '@/utils/supabase/middleware';

import { LinkPayloadSchema } from '../schema';

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

const unprocessableResponse = NextResponse.json(
  {
    message: 'unprocessable content',
  },
  {
    status: 402,
    statusText: 'unprocessable content',
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
export const GET = async (req: NextRequest, { params }: { params: Params }) => {
  const client = createClient(req);

  /* -------------------------------------------------------------------------- */
  const authUser = await client.supabase.auth
    .getUser()
    .then((userData) => userData.data.user);
  if (!authUser) return unauthorizedResponse;
  /* -------------------------------------------------------------------------- */

  try {
    const link = await db.query.LinkTable.findFirst({
      where: (fields, operators) => operators.eq(fields.id, params.link_id),
    });
    return NextResponse.json(link);
  } catch {
    return notfoundResponse;
  }
};

export const PUT = async (req: NextRequest, { params }: { params: Params }) => {
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

  /* -------------------------------------------------------------------------- */
  const requestPayload = await req.json();
  const result = LinkPayloadSchema.safeParse(requestPayload);
  if (!result.success) return unprocessableResponse;
  /* -------------------------------------------------------------------------- */

  try {
    const newlyUpdatedLinks = await db
      .update(LinkTable)
      .set(result.data)
      .where(eq(LinkTable.id, link_id))
      .returning();
    return NextResponse.json(newlyUpdatedLinks[0]);
  } catch (err) {
    return internalServerErrorResponse;
  }
};
