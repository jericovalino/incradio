import { db } from '@/drizzle/db';
import { LocalTable, UserTable } from '@/drizzle/schema';
import { createClient } from '@/utils/supabase/middleware';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { LocalPayload, LocalPayloadSchema } from './schema';
import { PostgresError } from 'postgres';

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
  const users = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.email, authUser.email!));
  if (users.length !== 1) return unauthorizedResponse;
  /* -------------------------------------------------------------------------- */

  const user = users[0];
  const locals = await db
    .select()
    .from(LocalTable)
    .where(eq(LocalTable.district_id, user.district_id));

  return NextResponse.json(locals);
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
  const users = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.email, authUser.email!));
  if (users.length !== 1) return unauthorizedResponse;
  /* -------------------------------------------------------------------------- */

  const user = users[0];

  const requestPayload = await req.json();
  const result = LocalPayloadSchema.safeParse(requestPayload);
  if (!result.success) return unprocessableResponse;

  let newlyInsertedLocals: Array<
    LocalPayload & {
      id: string;
      district_id: string;
    }
  >;
  try {
    newlyInsertedLocals = await db
      .insert(LocalTable)
      .values({
        ...result.data,
        district_id: user.district_id,
      })
      .returning();
  } catch (err) {
    const error = err as PostgresError;

    if ((error as PostgresError).code === '23505')
      return createUnprocessableResponse(error.detail);
    return internalServerErrorResponse;
  }

  return NextResponse.json(newlyInsertedLocals[0]);
};
