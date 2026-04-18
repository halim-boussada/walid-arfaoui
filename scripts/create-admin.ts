import bcrypt from "bcryptjs";
import { Pool } from "pg";
import * as readline from "readline";
import * as dotenv from "dotenv";
import { join } from "path";

// Load .env.local file
dotenv.config({ path: join(__dirname, "..", ".env.local") });

const pool = new Pool({
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl:
    process.env.DATABASE_ENABLE_SSL === "true"
      ? { rejectUnauthorized: false }
      : false,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdmin() {
  try {
    console.log("\n=== Create Admin User ===\n");

    const name = await question("Enter admin name: ");
    const email = await question("Enter admin email: ");
    const password = await question("Enter admin password: ");

    if (!name || !email || !password) {
      console.error("\nError: All fields are required!");
      process.exit(1);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    const result = await pool.query(
      "INSERT INTO admin_users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role",
      [email, hashedPassword, name, "super_admin"],
    );

    console.log("\n✅ Admin user created successfully!");
    console.log("\nUser Details:");
    console.log(`ID: ${result.rows[0].id}`);
    console.log(`Name: ${result.rows[0].name}`);
    console.log(`Email: ${result.rows[0].email}`);
    console.log(`Role: ${result.rows[0].role}`);
    console.log("\n");
  } catch (error: any) {
    if (error.code === "23505") {
      console.error("\n❌ Error: Email already exists!");
    } else {
      console.error("\n❌ Error creating admin user:", error.message);
    }
    process.exit(1);
  } finally {
    await pool.end();
    rl.close();
  }
}

createAdmin();
