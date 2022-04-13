import { Pool } from "pg";
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  host: process.env.DB_HOST as string,
  port: process.env.DB_PORT as any,
  database: process.env.DB_NAME as string,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
});

export default pool;
