import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import postgres from 'postgres';

const client = postgres(process.env.SUPABSE_DB_URL as string);
export const db = drizzle(client, {
  logger: true,
  schema,
});
