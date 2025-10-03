import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import database from './utils/database.js'
const app = express();

dotenv.config({});

// Enable CORS
app.use(cors());


async function testDBConnection() {
  try {
    await database.connect();
    const res = await database.query('SELECT * FROM events');
    console.log('Database connected successfully:', res.rows);
  }
  catch (error) {
    console.error('Database connection error:', error);
  }
  finally {
    await database.end();
  }
}

testDBConnection();
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});