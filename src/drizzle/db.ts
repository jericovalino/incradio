import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import postgres from 'postgres';

// const client = postgres(process.env.SUPABASE_DB_URL as string, {
//   max: 1,
// });

// export const db = drizzle(client, {
//   logger: true,
//   schema,
// });

let connection: postgres.Sql;

if (process.env.NODE_ENV === 'production') {
  connection = postgres(process.env.SUPABASE_DB_URL as string, {
    prepare: false,
  });
} else {
  const globalConnection = global as typeof globalThis & {
    connection: postgres.Sql;
  };

  if (!globalConnection.connection) {
    globalConnection.connection = postgres(
      process.env.SUPABASE_DB_URL as string,
      {
        prepare: false,
      }
    );
  }

  connection = globalConnection.connection;
}

export const db = drizzle(connection, {
  schema,
  logger: process.env.NODE_ENV === 'development',
});
