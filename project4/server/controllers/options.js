import { pool } from '../config/database.js';

// Get all exterior options
const getAllExteriors = async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM exteriors ORDER BY price ASC');
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all roof options
const getAllRoofs = async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM roofs ORDER BY price ASC');
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all wheel options
const getAllWheels = async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM wheels ORDER BY price ASC');
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all interior options
const getAllInteriors = async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM interiors ORDER BY price ASC');
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  getAllExteriors,
  getAllRoofs,
  getAllWheels,
  getAllInteriors
};
