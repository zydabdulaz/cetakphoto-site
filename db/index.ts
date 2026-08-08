import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const dbUrl = process.env.DATABASE_URL || (process.env.VERCEL ? 'file:/tmp/cetakphoto.db' : 'file:cetakphoto.db');

const client = createClient({
  url: dbUrl,
});

export const db = drizzle(client, { schema });
