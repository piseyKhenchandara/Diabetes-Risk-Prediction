import pkg from "pg";
const { Pool } = pkg;

// Pool is only created if DATABASE_URL is set — app works without a DB too
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

if (pool) {
  pool.on("error", (err) => {
    console.error("PostgreSQL pool error:", err.message);
  });
}

export default pool;
