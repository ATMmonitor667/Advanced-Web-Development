import dotenv from "dotenv";
dotenv.config(); // loads .env

import pkg from "pg";
const { Pool } = pkg;

// Create a connection pool
const database = new Pool({
  host: process.env.HOST,
  port: process.env.DBPORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

export default database;