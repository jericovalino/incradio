import { db } from '@/drizzle/db';
import { LocaleTable, UserTable } from '@/drizzle/schema';
import { createClient } from '@/utils/supabase/middleware';
import { asc, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { LocalePayload, LocalePayloadSchema } from './schema';
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
  const locales = await db
    .select()
    .from(LocaleTable)
    .where(eq(LocaleTable.district_id, user.district_id))
    .orderBy(asc(LocaleTable.name));

  return NextResponse.json(locales);
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
  const district = await db.query.DistrictTable.findFirst({
    where: (fields, operators) => operators.eq(fields.id, user.district_id),
  });
  if (!user) return unauthorizedResponse;
  /* -------------------------------------------------------------------------- */

  const requestPayload = await req.json();
  const result = LocalePayloadSchema.safeParse(requestPayload);
  if (!result.success) return unprocessableResponse;

  /* -------------------------------------------------------------------------- */
  const existingLocale = await db.query.LocaleTable.findFirst({
    where: (fields, operators) =>
      operators.and(
        operators.eq(fields.district_id, user.district_id),
        operators.eq(fields.code, result.data.code)
      ),
  });
  if (existingLocale)
    return createUnprocessableResponse(
      `locale code already exist in ${district?.name}`
    );
  /* -------------------------------------------------------------------------- */

  try {
    type NewlyInsertedLocales = Array<
      LocalePayload & {
        id: string;
        district_id: string;
      }
    >;
    const newlyInsertedLocales: NewlyInsertedLocales = await db
      .insert(LocaleTable)
      .values({
        ...result.data,
        district_id: user.district_id,
      })
      .returning();
    return NextResponse.json(newlyInsertedLocales[0]);
  } catch (err) {
    const error = err as PostgresError;

    if ((error as PostgresError).code === '23505')
      return createUnprocessableResponse(error.detail);
    return internalServerErrorResponse;
  }
};
