import pool from '../lib/db';
import fs from 'fs';
import path from 'path';

async function setupAppointmentsTable() {
  try {
    console.log('Setting up appointments table...');

    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'lib', 'setup-appointments-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL
    await pool.query(sql);

    console.log('✓ Appointments table created successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error setting up appointments table:', error);
    process.exit(1);
  }
}

setupAppointmentsTable();
