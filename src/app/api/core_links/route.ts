import { eq, InferSelectModel } from 'drizzle-orm';
import { db } from '@/drizzle/db';
import { PostgresError } from 'postgres';
import { LinkTable, LocalTable, UserTable } from '@/drizzle/schema';
import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/middleware';

import { LinkPayload, LinkPayloadSchema } from './schema';
import { nanoid } from 'nanoid';

const unauthorizedResponse = NextResponse.json(
  {
    message: 'unauthorized',
  },
  {
    status: 401,
    statusText: 'unauthorized',
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

const createUnprocessableResponse = (message?: string) =>
  NextResponse.json(
    {
      message: message ?? 'unprocessable content',
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

export const GET = async (req: NextRequest) => {
  const client = createClient(req);

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

  const links = await db.query.LinkTable.findMany({
    where: (fields, operators) =>
      operators.eq(fields.district_id, user.district_id),
  });
  return NextResponse.json(links);
};

export const POST = async (req: NextRequest) => {
  const client = createClient(req);

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

  const requestPayload = await req.json();
  const result = LinkPayloadSchema.safeParse(requestPayload);
  if (!result.success) return unprocessableResponse;

  let newlyInsertedLinks: InferSelectModel<typeof LinkTable>[];

  try {
    newlyInsertedLinks = await db
      .insert(LinkTable)
      .values({
        ...result.data,
        district_id: user.district_id,
        code: nanoid(),
      })
      .returning();
  } catch (err) {
    const error = err as PostgresError;
    if ((error as PostgresError).code === '23505')
      return createUnprocessableResponse(error.detail);
    return internalServerErrorResponse;
  }

  return NextResponse.json(newlyInsertedLinks[0]);
};
