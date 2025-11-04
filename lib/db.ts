import { Pool } from 'pg';

let pool: Pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });
} else {
  // In development, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._pgPool) {
    global._pgPool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });
  }
  pool = global._pgPool;
}

export const db = pool;
