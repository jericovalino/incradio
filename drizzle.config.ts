import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/drizzle/schema.ts',
  out: './src/drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.NEXT_PRIVATE_SUPABASE_DB_URL as string,
  },
  verbose: true,
  strict: true,
});
