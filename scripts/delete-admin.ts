import { Pool } from "pg";
import * as readline from "readline";
import * as dotenv from "dotenv";
import { join } from "path";

// Load .env file
dotenv.config({ path: join(__dirname, "..", ".env") });

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

async function deleteAdmin() {
  try {
    console.log("\n=== Delete Admin User ===\n");

    const email = await question("Enter admin email to delete: ");

    if (!email) {
      console.error("\nError: Email is required!");
      process.exit(1);
    }

    const confirm = await question(
      `Are you sure you want to delete ${email}? (yes/no): `,
    );

    if (confirm.toLowerCase() !== "yes") {
      console.log("\nDeletion cancelled.");
      process.exit(0);
    }

    const result = await pool.query(
      "DELETE FROM admin_users WHERE email = $1 RETURNING email",
      [email],
    );

    if (result.rows.length === 0) {
      console.log("\n❌ Admin user not found.");
    } else {
      console.log(`\n✅ Admin user ${email} deleted successfully!\n`);
    }
  } catch (error: any) {
    console.error("\n❌ Error deleting admin user:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
    rl.close();
  }
}

deleteAdmin();
