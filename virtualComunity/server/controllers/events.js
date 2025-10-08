import { pool } from '../config/database.js';

// Get all events
const getEvents = async (req, res) => {
  try {
    const results = await pool.query(`
      SELECT events.*, locations.name as location_name
      FROM events
      LEFT JOIN locations ON events.location_id = locations.id
      ORDER BY events.start_time DESC
    `);
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single event by ID
const getEventById = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const results = await pool.query(`
      SELECT events.*, locations.name as location_name
      FROM events
      LEFT JOIN locations ON events.location_id = locations.id
      WHERE events.id = $1
    `, [eventId]);

    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get events by location ID
const getEventsByLocation = async (req, res) => {
  try {
    const locationId = parseInt(req.params.locationId);
    const results = await pool.query(`
      SELECT events.*, locations.name as location_name
      FROM events
      LEFT JOIN locations ON events.location_id = locations.id
      WHERE events.location_id = $1
      ORDER BY events.start_time DESC
    `, [locationId]);

    res.status(200).json(results.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  getEvents,
  getEventById,
  getEventsByLocation
};