import 'dotenv/config';

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const connectionString = process.env.SUPABASE_DB_URL as string;
const client = postgres(connectionString, {
  max: 1,
});

const main = async () => {
  const db = drizzle(client);
  await migrate(db, {
    migrationsFolder: './src/drizzle/migrations',
  });
  await client.end();
  console.log('migrated');
};

main();
