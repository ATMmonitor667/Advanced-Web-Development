import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/routes.js';
import { checkDatabaseConnection } from './config/database.js';

// ES module path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files from client/dist directory
const clientPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientPath));

// API routes
app.use('/api', router);

// SPA fallback - serve index.html for all non-API routes
app.use((req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Start server and check database connection
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
  console.log('\n🔍 Checking database connection...');
  await checkDatabaseConnection();
});
