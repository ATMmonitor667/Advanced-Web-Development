import { pool } from './database.js';

const createTables = async () => {
  const createTablesQuery = `
    DROP TABLE IF EXISTS custom_cars CASCADE;
    DROP TABLE IF EXISTS exteriors CASCADE;
    DROP TABLE IF EXISTS roofs CASCADE;
    DROP TABLE IF EXISTS wheels CASCADE;
    DROP TABLE IF EXISTS interiors CASCADE;

    -- Table for exterior color options
    CREATE TABLE exteriors (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      color VARCHAR(50) NOT NULL,
      price INTEGER NOT NULL,
      image_url TEXT
    );

    -- Table for roof options
    CREATE TABLE roofs (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      type VARCHAR(50) NOT NULL,
      price INTEGER NOT NULL,
      convertible BOOLEAN DEFAULT FALSE
    );

    -- Table for wheel options
    CREATE TABLE wheels (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      size INTEGER NOT NULL,
      price INTEGER NOT NULL,
      image_url TEXT
    );

    -- Table for interior options
    CREATE TABLE interiors (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      material VARCHAR(50) NOT NULL,
      color VARCHAR(50) NOT NULL,
      price INTEGER NOT NULL
    );

    -- Table for custom cars
    CREATE TABLE custom_cars (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      exterior_id INTEGER REFERENCES exteriors(id),
      roof_id INTEGER REFERENCES roofs(id),
      wheels_id INTEGER REFERENCES wheels(id),
      interior_id INTEGER REFERENCES interiors(id),
      total_price INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTablesQuery);
    console.log('🎯 All tables created successfully');
  } catch (err) {
    console.error('⚠️ Error creating tables:', err);
  }
};

const seedOptions = async () => {
  const seedQuery = `
    -- Seed exterior options
    INSERT INTO exteriors (name, color, price, image_url) VALUES
      ('Midnight Black', 'black', 0, '🖤'),
      ('Racing Red', 'red', 500, '❤️'),
      ('Ocean Blue', 'blue', 500, '💙'),
      ('Pearl White', 'white', 1000, '🤍'),
      ('Metallic Silver', 'silver', 1500, '🩶'),
      ('Electric Green', 'green', 2000, '💚');

    -- Seed roof options
    INSERT INTO roofs (name, type, price, convertible) VALUES
      ('Standard Roof', 'hardtop', 0, FALSE),
      ('Sunroof', 'sunroof', 1500, FALSE),
      ('Panoramic Sunroof', 'panoramic', 2500, FALSE),
      ('Convertible Soft Top', 'convertible', 3000, TRUE),
      ('Convertible Hard Top', 'convertible', 3500, TRUE);

    -- Seed wheel options
    INSERT INTO wheels (name, size, price, image_url) VALUES
      ('Standard 16"', 16, 0, '⭕'),
      ('Sport 18"', 18, 1000, '🔵'),
      ('Premium 19"', 19, 2000, '⚪'),
      ('Racing 20"', 20, 3000, '🔴'),
      ('Chrome 19"', 19, 2500, '✨');

    -- Seed interior options
    INSERT INTO interiors (name, material, color, price) VALUES
      ('Standard Cloth', 'cloth', 'gray', 0),
      ('Premium Cloth', 'cloth', 'black', 500),
      ('Leather', 'leather', 'black', 2000),
      ('Leather', 'leather', 'tan', 2000),
      ('Premium Leather', 'leather', 'white', 3000),
      ('Alcantara Sport', 'alcantara', 'black', 3500),
      ('Alcantara Sport', 'alcantara', 'red', 3500);
  `;

  try {
    await pool.query(seedQuery);
    console.log('✅ Options seeded successfully');
  } catch (err) {
    console.error('⚠️ Error seeding options:', err);
  }
};

const seedCustomCars = async () => {
  const seedQuery = `
    INSERT INTO custom_cars (name, exterior_id, roof_id, wheels_id, interior_id, total_price) VALUES
      ('Dream Machine', 4, 3, 4, 5, 48500),
      ('Speed Demon', 2, 5, 4, 6, 50000),
      ('Classic Cruiser', 1, 1, 1, 1, 40000);
  `;

  try {
    await pool.query(seedQuery);
    console.log('✅ Sample custom cars seeded successfully');
  } catch (err) {
    console.error('⚠️ Error seeding custom cars:', err);
  }
};

const setup = async () => {
  await createTables();
  await seedOptions();
  await seedCustomCars();
  pool.end();
};

setup();
