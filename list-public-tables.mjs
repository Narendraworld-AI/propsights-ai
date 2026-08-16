import pg from 'pg';
import fs from 'fs';

let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('DATABASE_URL=')) {
      databaseUrl = trimmed.substring('DATABASE_URL='.length).replace(/^["']|["']$/g, '');
      break;
    }
  }
}

const { Pool } = pg;

async function run() {
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  const client = await pool.connect();
  console.log('Connected to PostgreSQL!');

  const tables = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);

  console.log('Public Schema Tables:', tables.rows.map(r => r.table_name));

  for (const t of tables.rows) {
    const count = await client.query(`SELECT count(*) FROM "public"."${t.table_name}"`);
    console.log(`Table ${t.table_name}: ${count.rows[0].count} rows`);
    const rows = await client.query(`SELECT * FROM "public"."${t.table_name}" LIMIT 5`);
    console.log(`Sample data for ${t.table_name}:`, rows.rows);
  }

  client.release();
  await pool.end();
}

run().catch(console.error);
