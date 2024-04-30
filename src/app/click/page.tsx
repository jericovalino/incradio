import { headers } from 'next/headers';
import { NextRequest } from 'next/server';

import { db } from '@/drizzle/db';
import { notFound, redirect } from 'next/navigation';
import { ClickTable } from '@/drizzle/schema';

const getClientIP = (requestHeaders: NextRequest['headers']) => {
  const FALLBACK_IP_ADDRESS = '0.0.0.0';
  const forwardedFor = requestHeaders.get('x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0] ?? FALLBACK_IP_ADDRESS;
  }

  return requestHeaders.get('x-real-ip') ?? FALLBACK_IP_ADDRESS;
};
const Click = async ({
  searchParams,
}: {
  searchParams?: { local?: string; link?: string };
}) => {
  const headerList = headers();

  /* -------------------------------------------------------------------------- */
  const ip = getClientIP(headerList);
  const local_code = searchParams?.local;
  const link_code = searchParams?.link;
  if (!local_code || !link_code) return notFound();
  /* -------------------------------------------------------------------------- */
  const link = await db.query.LinkTable.findFirst({
    where: (fields, operators) => operators.eq(fields.code, link_code),
  });
  if (!link) return notFound();
  /* -------------------------------------------------------------------------- */
  const local = await db.query.LocalTable.findFirst({
    where: (fields, operators) => operators.eq(fields.code, local_code),
  });
  if (!local) return notFound();
  /* -------------------------------------------------------------------------- */

  await db.insert(ClickTable).values({
    ip,
    link_code,
    local_code,
  });

  return redirect(link?.url);
};

export default Click;
