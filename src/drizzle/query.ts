import 'dotenv/config';

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

import { UserTable } from './schema';

const connectionString = process.env.SUPABASE_DB_URL as string;
const client = postgres(connectionString, {
  max: 1,
});

const main = async () => {
  const db = drizzle(client);
  const users = await db.select().from(UserTable);

  console.log({ users });
};

main();
