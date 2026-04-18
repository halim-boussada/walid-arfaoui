import { Pool } from "pg";
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

async function listAdmins() {
  try {
    console.log("\n=== Admin Users ===\n");

    const result = await pool.query(
      "SELECT id, email, name, role, created_at FROM admin_users ORDER BY created_at DESC",
    );

    if (result.rows.length === 0) {
      console.log("No admin users found.");
    } else {
      result.rows.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(
          `   Created: ${new Date(user.created_at).toLocaleString()}`,
        );
        console.log("");
      });
    }

    console.log(`Total: ${result.rows.length} admin user(s)\n`);
  } catch (error: any) {
    console.error("❌ Error fetching admin users:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

listAdmins();
