import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  // Only use SSL for production databases (like Render, Railway)
  ...(isProduction && {
    ssl: {
      rejectUnauthorized: false
    }
  })
};

export const pool = new pg.Pool(config);

// Function to check database connection
export const checkDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connected successfully!');
    console.log('📅 Database time:', result.rows[0].now);
    return { success: true, timestamp: result.rows[0].now };
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return { success: false, error: error.message };
  }
};