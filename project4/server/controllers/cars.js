import { pool } from '../config/database.js';

// Get all custom cars with full details
const getAllCars = async (req, res) => {
  try {
    const query = `
      SELECT
        cc.*,
        e.name as exterior_name, e.color as exterior_color, e.price as exterior_price,
        r.name as roof_name, r.type as roof_type, r.price as roof_price, r.convertible,
        w.name as wheels_name, w.size as wheels_size, w.price as wheels_price,
        i.name as interior_name, i.material as interior_material, i.color as interior_color, i.price as interior_price
      FROM custom_cars cc
      LEFT JOIN exteriors e ON cc.exterior_id = e.id
      LEFT JOIN roofs r ON cc.roof_id = r.id
      LEFT JOIN wheels w ON cc.wheels_id = w.id
      LEFT JOIN interiors i ON cc.interior_id = i.id
      ORDER BY cc.created_at DESC
    `;

    const results = await pool.query(query);
    res.status(200).json(results.rows);
  } catch (error) {
    console.error('Error getting cars:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get a single custom car by ID
const getCarById = async (req, res) => {
  try {
    const carId = parseInt(req.params.id);
    const query = `
      SELECT
        cc.*,
        e.name as exterior_name, e.color as exterior_color, e.price as exterior_price,
        r.name as roof_name, r.type as roof_type, r.price as roof_price, r.convertible,
        w.name as wheels_name, w.size as wheels_size, w.price as wheels_price,
        i.name as interior_name, i.material as interior_material, i.color as interior_color, i.price as interior_price
      FROM custom_cars cc
      LEFT JOIN exteriors e ON cc.exterior_id = e.id
      LEFT JOIN roofs r ON cc.roof_id = r.id
      LEFT JOIN wheels w ON cc.wheels_id = w.id
      LEFT JOIN interiors i ON cc.interior_id = i.id
      WHERE cc.id = $1
    `;

    const results = await pool.query(query, [carId]);

    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error('Error getting car:', error);
    res.status(400).json({ error: error.message });
  }
};

// Create a new custom car
const createCar = async (req, res) => {
  try {
    const { name, exterior_id, roof_id, wheels_id, interior_id, total_price } = req.body;

    // Validation: Check for incompatible combinations
    // Convertible roofs cannot have sunroofs
    if (roof_id) {
      const roofCheck = await pool.query('SELECT convertible FROM roofs WHERE id = $1', [roof_id]);
      if (roofCheck.rows[0]?.convertible && [2, 3].includes(roof_id)) {
        return res.status(400).json({
          error: 'Invalid combination: Convertible roofs cannot have sunroof options'
        });
      }
    }

    const query = `
      INSERT INTO custom_cars (name, exterior_id, roof_id, wheels_id, interior_id, total_price)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const results = await pool.query(query, [name, exterior_id, roof_id, wheels_id, interior_id, total_price]);
    res.status(201).json(results.rows[0]);
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(400).json({ error: error.message });
  }
};

// Update an existing custom car
const updateCar = async (req, res) => {
  try {
    const carId = parseInt(req.params.id);
    const { name, exterior_id, roof_id, wheels_id, interior_id, total_price } = req.body;

    // Validation: Check for incompatible combinations
    if (roof_id) {
      const roofCheck = await pool.query('SELECT convertible FROM roofs WHERE id = $1', [roof_id]);
      if (roofCheck.rows[0]?.convertible && [2, 3].includes(roof_id)) {
        return res.status(400).json({
          error: 'Invalid combination: Convertible roofs cannot have sunroof options'
        });
      }
    }

    const query = `
      UPDATE custom_cars
      SET name = $1, exterior_id = $2, roof_id = $3, wheels_id = $4, interior_id = $5, total_price = $6
      WHERE id = $7
      RETURNING *
    `;

    const results = await pool.query(query, [name, exterior_id, roof_id, wheels_id, interior_id, total_price, carId]);

    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a custom car
const deleteCar = async (req, res) => {
  try {
    const carId = parseInt(req.params.id);
    const results = await pool.query('DELETE FROM custom_cars WHERE id = $1 RETURNING *', [carId]);

    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.status(200).json({ message: 'Car deleted successfully', car: results.rows[0] });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(400).json({ error: error.message });
  }
};

export default {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
};
