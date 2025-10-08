import express from "express";
import dotenv from "dotenv";
import database from "./utils/Database.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// ES module path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({});

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files from client directory
const clientPath = path.join(__dirname, '../client');
app.use(express.static(clientPath));

const PORT = process.env.PORT || 5000;

// API routes
app.get('/api', async (req, res) => {
  try {
    const result = await database.query('SELECT * FROM demonslayer ORDER BY power DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { attribute, operator, value, query } = req.query;

    let sql = 'SELECT * FROM demonslayer WHERE 1=1';
    let params = [];

    if (query) {
      // General text search
      sql += ` AND (LOWER(name) LIKE $${params.length + 1} OR LOWER(breathing) LIKE $${params.length + 1})`;
      params.push(`%${query.toLowerCase()}%`);
    }

    if (attribute && operator && value) {
      // Specific attribute search
      const validAttributes = ['power', 'speed', 'durability', 'intelligence'];
      const validOperators = ['>', '<', '>=', '<=', '='];

      if (validAttributes.includes(attribute) && validOperators.includes(operator)) {
        sql += ` AND ${attribute} ${operator} $${params.length + 1}`;
        params.push(parseInt(value));
      }
    }

    sql += ' ORDER BY power DESC';

    const result = await database.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to search characters' });
  }
});

app.get('/api/name/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const result = await database.query(
      'SELECT * FROM demonslayer WHERE LOWER(name) = LOWER($1)',
      [name]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch character' });
  }
});

// HTML routes
app.get('/', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

app.get('/characters/:name', (req, res) => {
  res.sendFile(path.join(clientPath, 'character.html'));
});

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// 404 handler for all other routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(clientPath, '404.html'));
});

async function testConnection() {
  try {
    const result = await database.query('SELECT * FROM demonslayer');
    console.log(`Connected to database. Found ${result.rows.length} characters.`);
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

testConnection();

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
