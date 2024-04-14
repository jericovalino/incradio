import { NextRequest } from 'next/server';

import { createClient } from '@/utils/supabase/middleware';

export async function GET(req: NextRequest) {
  const client = createClient(req);

  const user = await client.supabase.auth
    .getUser()
    .then((userData) => userData.data.user);

  console.log('user: ', user);

  const data = { name: 'ikoy' };
  return Response.json({ data });
}
