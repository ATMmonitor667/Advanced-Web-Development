import { pool } from './database.js';
import './dotenv.js';

const createLocationsTable = async () => {
  const createTableQuery = `
    DROP TABLE IF EXISTS events;
    DROP TABLE IF EXISTS locations;

    CREATE TABLE IF NOT EXISTS locations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      universe VARCHAR(100),
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('🎯 locations table created');
  } catch (err) {
    console.error('⚠️ error creating locations table', err);
  }
};

const createEventsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP NOT NULL,
      location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
      universe VARCHAR(100),
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('🎯 events table created');
  } catch (err) {
    console.error('⚠️ error creating events table', err);
  }
};

const seedLocationsTable = async () => {
  await createLocationsTable();

  const insertQuery = `
    INSERT INTO locations (name, description, universe, image_url)
    VALUES
      ('Cell Games Arena', 'A huge ring built by Cell for his ultimate tournament.', 'Dragon Ball', 'https://picsum.photos/seed/cellgames/400/200'),
      ('Planet Namek', 'Remote planet where Frieza fought Goku.', 'Dragon Ball', 'https://picsum.photos/seed/namek/400/200'),
      ('Hidden Leaf Village', 'Main village in the Naruto series.', 'Naruto', 'https://picsum.photos/seed/leaf/400/200'),
      ('Marineford', 'Naval headquarters and battleground in One Piece.', 'One Piece', 'https://picsum.photos/seed/marineford/400/200'),
      ('Tournament of Power Arena', 'Null realm fighting stage.', 'Dragon Ball Super', 'https://picsum.photos/seed/top/400/200');
  `;

  try {
    await pool.query(insertQuery);
    console.log('✅ locations seeded');
  } catch (err) {
    console.error('⚠️ error seeding locations table', err);
  }
};

const seedEventsTable = async () => {
  await createEventsTable();

  const insertQuery = `
    INSERT INTO events (title, description, start_time, end_time, location_id, universe, image_url)
    VALUES
      ('The Cell Games', 'Goku and Gohan vs Cell.', '2025-11-10 10:00:00', '2025-11-10 18:00:00', 1, 'Dragon Ball', 'https://picsum.photos/seed/cellevent/400/200'),
      ('Frieza Final Battle', 'Super Saiyan Goku vs Frieza.', '2025-11-12 14:00:00', '2025-11-12 17:00:00', 2, 'Dragon Ball', 'https://picsum.photos/seed/frieza/400/200'),
      ('Naruto vs Pain', 'Epic showdown protecting the Leaf Village.', '2025-11-15 09:00:00', '2025-11-15 13:00:00', 3, 'Naruto', 'https://picsum.photos/seed/pain/400/200'),
      ('Marineford War', 'Whitebeard vs Marines.', '2025-11-20 08:00:00', '2025-11-20 20:00:00', 4, 'One Piece', 'https://picsum.photos/seed/marine/400/200'),
      ('Tournament of Power Finale', 'Goku & Frieza vs Jiren.', '2025-11-25 15:00:00', '2025-11-25 18:00:00', 5, 'Dragon Ball Super', 'https://picsum.photos/seed/topfinal/400/200'),
      ('Vegeta Training Session', 'Vegeta pushes his limits at Cell Games Arena.', '2025-10-05 07:00:00', '2025-10-05 09:00:00', 1, 'Dragon Ball', 'https://picsum.photos/seed/vegeta/400/200'),
      ('Piccolo Meditation', 'Piccolo meditates before the tournament.', '2025-10-08 06:00:00', '2025-10-08 08:00:00', 1, 'Dragon Ball', 'https://picsum.photos/seed/piccolo/400/200'),
      ('Gohan Ultimate Training', 'Gohan unlocks his ultimate form.', '2025-11-05 10:00:00', '2025-11-05 16:00:00', 2, 'Dragon Ball', 'https://picsum.photos/seed/gohan/400/200'),
      ('Sasuke vs Itachi', 'Brothers settle their differences.', '2025-11-18 12:00:00', '2025-11-18 15:00:00', 3, 'Naruto', 'https://picsum.photos/seed/sasuke/400/200'),
      ('Luffy vs Kaido', 'Final showdown at Onigashima.', '2025-11-22 10:00:00', '2025-11-22 18:00:00', 4, 'One Piece', 'https://picsum.photos/seed/luffy/400/200');
  `;

  try {
    await pool.query(insertQuery);
    console.log('✅ events seeded');
  } catch (err) {
    console.error('⚠️ error seeding events table', err);
  }
};

const setup = async () => {
  await seedLocationsTable();
  await seedEventsTable();
  pool.end();
};

setup();