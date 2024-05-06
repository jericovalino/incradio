import { eq } from 'drizzle-orm';
import { db } from '@/drizzle/db';
import { NextRequest, NextResponse } from 'next/server';

import { LinkTable, LocaleTable } from '@/drizzle/schema';
import { createClient } from '@/utils/supabase/middleware';

import { LocalePayloadSchema } from '../schema';

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
  locale_id: string;
};

export const PUT = async (req: NextRequest, { params }: { params: Params }) => {
  const client = createClient(req);
  const { locale_id } = params;

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
  const locale = await db.query.LocaleTable.findFirst({
    where: (fields, operators) => operators.eq(fields.id, locale_id),
  });
  if (!locale) return notfoundResponse;
  if (locale.district_id !== user.district_id) return unauthorizedResponse;
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  const requestPayload = await req.json();
  const result = LocalePayloadSchema.safeParse(requestPayload);
  if (!result.success) return unprocessableResponse;
  /* -------------------------------------------------------------------------- */

  try {
    const newlyUpdatedLocales = await db
      .update(LocaleTable)
      .set(result.data)
      .where(eq(LocaleTable.id, locale_id))
      .returning();
    return NextResponse.json(newlyUpdatedLocales[0]);
  } catch (err) {
    return internalServerErrorResponse;
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Params }
) => {
  const client = createClient(req);
  const { locale_id } = params;

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
  const locale = await db.query.LocaleTable.findFirst({
    where: (fields, operators) => operators.eq(fields.id, locale_id),
  });
  if (!locale) return notfoundResponse;
  if (locale.district_id !== user.district_id) return unauthorizedResponse;
  /* -------------------------------------------------------------------------- */

  try {
    const newlyDeletedLocales = await db
      .delete(LocaleTable)
      .where(eq(LocaleTable.id, locale_id))
      .returning();
    return NextResponse.json(newlyDeletedLocales[0]);
  } catch (err) {
    return internalServerErrorResponse;
  }
};
