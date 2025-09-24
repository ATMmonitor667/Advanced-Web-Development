import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import supabase from './utils/supabase.js';
import fighterRoutes from "./routes/fighterRoutes.js";

dotenv.config({});

const app = express();
const PORT = process.env.PORT || 3000;

// Get directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDir = path.join(__dirname, '..', 'client');

app.use(cors());
app.use(express.json());

// Serve static files from client directory
app.use(express.static(clientDir));

// API routes
//await database.connect()
app.use("/api", fighterRoutes);

// HTML routes
app.get('/', (req, res) => {
  res.sendFile(path.join(clientDir, 'index.html'));
});

app.get('/fighters/:name', (req, res) => {
  res.sendFile(path.join(clientDir, 'fighter.html'));
});

// 404 handler (must be last)
app.use((req, res) => {
  res.status(404).sendFile(path.join(clientDir, '404.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
