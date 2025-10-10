import { pool } from './config/database.js';

const testConnection = async () => {
  try {
    console.log('Testing database query...');
    const result = await pool.query('SELECT * FROM locations');
    console.log('✅ Query successful!');
    console.log('📊 Found', result.rows.length, 'locations');
    console.log('Data:', JSON.stringify(result.rows, null, 2));
    pool.end();
  } catch (error) {
    console.error('❌ Query failed:', error.message);
    console.error('Full error:', error);
    pool.end();
  }
};

testConnection();
