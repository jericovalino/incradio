import hash from 'object-hash';
import { headers } from 'next/headers';
import { NextRequest, userAgent } from 'next/server';

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
  searchParams?: { locale?: string; link?: string; district?: string };
}) => {
  const headerList = headers();
  const userAgentList = userAgent({ headers: headerList });

  console.log('userAgentList: ', userAgentList);
  console.log('useAgentHash: ', hash(userAgent));

  /* -------------------------------------------------------------------------- */
  const ip = getClientIP(headerList);
  const locale_code = searchParams?.locale;
  const link_code = searchParams?.link;
  const district_code = searchParams?.district;
  if (!locale_code || !link_code || !district_code) return notFound();
  /* -------------------------------------------------------------------------- */
  const link = await db.query.LinkTable.findFirst({
    where: (fields, operators) => operators.eq(fields.code, link_code),
  });
  if (!link) return notFound();
  if (link.status === 'ARCHIVED') return notFound();
  /* -------------------------------------------------------------------------- */
  const district = await db.query.DistrictTable.findFirst({
    where: (fields, operators) => operators.eq(fields.code, district_code),
  });
  if (!district) return notFound();
  /* -------------------------------------------------------------------------- */
  const locale = await db.query.LocaleTable.findFirst({
    where: (fields, operators) => operators.eq(fields.code, locale_code),
  });
  if (!locale) return notFound();
  /* -------------------------------------------------------------------------- */

  // if (!userAgentList.isBot) {
  await db.insert(ClickTable).values({
    ip,
    link_code,
    locale_code,
    district_code,
    user_agent_stringify: JSON.stringify(userAgentList),
    is_bot: userAgentList.isBot,
    user_agent_hash: hash(userAgentList),
  });
  // }

  return redirect(link?.url);
};

export default Click;
