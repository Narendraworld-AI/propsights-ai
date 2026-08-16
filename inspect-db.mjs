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

async function inspect() {
  if (!databaseUrl) {
    console.error('Error: DATABASE_URL not found');
    return;
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL successfully!');

    // 1. Get all tables in public schema
    const tablesRes = await client.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
      ORDER BY table_schema, table_name;
    `);

    console.log('\n--- TABLES FOUND ---');
    console.log(JSON.stringify(tablesRes.rows, null, 2));

    for (const row of tablesRes.rows) {
      const fullTableName = `"${row.table_schema}"."${row.table_name}"`;
      
      // Get columns
      const colsRes = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = $1 AND table_name = $2
        ORDER BY ordinal_position;
      `, [row.table_schema, row.table_name]);

      console.log(`\n=== Table: ${fullTableName} ===`);
      console.log('Columns:');
      console.table(colsRes.rows);

      // Count rows
      try {
        const countRes = await client.query(`SELECT count(*) FROM ${fullTableName};`);
        console.log(`Row count: ${countRes.rows[0].count}`);

        // Fetch first 5 rows
        const sampleRes = await client.query(`SELECT * FROM ${fullTableName} LIMIT 5;`);
        console.log('Sample rows:', sampleRes.rows);
      } catch (err) {
        console.log(`Could not query rows: ${err.message}`);
      }
    }

    client.release();
    await pool.end();
  } catch (err) {
    console.error('Inspection failed:', err);
  }
}

inspect();
