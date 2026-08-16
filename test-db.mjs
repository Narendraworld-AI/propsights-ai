import pg from 'pg';
import fs from 'fs';
import path from 'path';

// Read DATABASE_URL from .env using built-in fs (no external dotenv dependency needed)
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

async function testConnection() {
  console.log('🔍 Testing connection to Supabase PostgreSQL...');
  
  if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL is not set in .env');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to Supabase!');
    
    const res = await client.query('SELECT NOW() as current_time, version() as pg_version;');
    console.log('🕒 Server Time:', res.rows[0].current_time);
    console.log('📦 PostgreSQL Version:', res.rows[0].pg_version.split(' ')[0] + ' ' + res.rows[0].pg_version.split(' ')[1]);
    
    client.release();
    await pool.end();
    console.log('🎉 Database verification complete! Everything is configured properly.');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();
