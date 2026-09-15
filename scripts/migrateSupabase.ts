import { Client } from 'pg';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL is not set in .env');
  process.exit(1);
}

async function runMigration() {
  console.log('⚡ Connecting directly to Supabase PostgreSQL cloud database...');
  console.log(`🔗 Target Host: db.zbwpvedsulwjzbejynqa.supabase.co:5432/postgres\n`);

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 15000,
  });

  try {
    await client.connect();
    console.log('✅ Successfully connected to Supabase PostgreSQL database!');

    // 1. Check current server version
    const versionRes = await client.query('SELECT version();');
    console.log(`📌 Database Version: ${versionRes.rows[0].version.split(',')[0]}`);

    // 2. Read schema SQL
    const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at: ${schemaPath}`);
    }

    console.log(`\n📦 Executing schema migration from: ${schemaPath}...`);
    const sqlContent = fs.readFileSync(schemaPath, 'utf8');

    await client.query(sqlContent);
    console.log('🎉 Schema migration executed successfully!');

    // 3. Verify created tables
    console.log('\n🔍 Verifying created tables in public schema:');
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('📋 Existing public tables:');
    for (const row of tablesRes.rows) {
      console.log(`   • ${row.table_name}`);
    }

    // 4. Verify seed users
    const usersRes = await client.query('SELECT username, role, name FROM public.users;');
    console.log(`\n👥 Seed Users in Supabase (${usersRes.rowCount} users):`);
    for (const user of usersRes.rows) {
      console.log(`   • [${user.role.toUpperCase()}] ${user.username} (${user.name})`);
    }

    // 5. Verify MSP rates
    const mspRes = await client.query('SELECT crop_name, msp_rate, unit FROM public.crops_msp LIMIT 5;');
    console.log(`\n🌾 Sample Central Govt MSP Rates in Supabase:`);
    for (const msp of mspRes.rows) {
      console.log(`   • ${msp.crop_name}: ₹${msp.msp_rate} / ${msp.unit}`);
    }

    console.log('\n==========================================================');
    console.log('✅ SUPABASE CLOUD DATABASE IS FULLY INITIALIZED & READY! ');
    console.log('==========================================================\n');

  } catch (err: any) {
    console.error('❌ Supabase Migration Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
