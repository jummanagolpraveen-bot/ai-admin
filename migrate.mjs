import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("Please set DATABASE_URL environment variable.");
    process.exit(1);
  }
  const client = new Client({
    connectionString,
  });

  try {
    await client.connect();
    console.log("Connected to database");

    const sql = fs.readFileSync(path.join(process.cwd(), 'supabase_setup.sql'), 'utf8');
    
    console.log("Running SQL migration...");
    await client.query(sql);
    console.log("Migration executed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

runMigration();
