import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import postgres from 'postgres';

const client = postgres(process.env.SUPABASE_DB_URL as string, {
  max: 1,
});
export const db = drizzle(client, {
  logger: true,
  schema,
});
