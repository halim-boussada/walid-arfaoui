import pool from '../lib/db';
import fs from 'fs';
import path from 'path';

async function setupQaTable() {
  try {
    console.log('Setting up Q&A table...');

    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'lib', 'setup-qa-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL
    await pool.query(sql);

    console.log('✓ Q&A table created successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error setting up Q&A table:', error);
    process.exit(1);
  }
}

setupQaTable();
