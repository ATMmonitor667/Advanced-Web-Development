-- Main table for storing created custom items
CREATE TABLE custom_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    exterior_color VARCHAR(50),
    wheels VARCHAR(50),
    interior VARCHAR(50),
    engine VARCHAR(50),
    total_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Features table (e.g., exterior, wheels, interior, engine)
CREATE TABLE features (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- Options for each feature (e.g., red, blue, black for exterior)
CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    feature_id INT NOT NULL REFERENCES features(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    icon_class VARCHAR(100),
    UNIQUE(feature_id, name)
);

-- Maps which options were selected for each custom item
CREATE TABLE item_selections (
    id SERIAL PRIMARY KEY,
    custom_item_id INT NOT NULL REFERENCES custom_items(id) ON DELETE CASCADE,
    feature_id INT NOT NULL REFERENCES features(id),
    option_id INT NOT NULL REFERENCES options(id),
    UNIQUE(custom_item_id, feature_id)
);

-- Sample data for features
INSERT INTO features (name, description) VALUES
('Exterior Color', 'The color of the car exterior'),
('Wheels', 'Type of wheels'),
('Interior', 'Interior material and color'),
('Engine', 'Engine type and performance');

-- Sample data for options
INSERT INTO options (feature_id, name, price, icon_class) VALUES
-- Exterior colors
(1, 'Red', 0, 'color-red'),
(1, 'Blue', 500, 'color-blue'),
(1, 'Black', 1000, 'color-black'),
(1, 'Silver', 1500, 'color-silver'),

-- Wheels
(2, 'Standard', 0, 'wheels-standard'),
(2, 'Sport', 2000, 'wheels-sport'),
(2, 'Luxury', 4000, 'wheels-luxury'),

-- Interior
(3, 'Cloth', 0, 'interior-cloth'),
(3, 'Leather', 3000, 'interior-leather'),
(3, 'Premium Leather', 5000, 'interior-premium'),

-- Engine
(4, 'Standard', 0, 'engine-standard'),
(4, 'Turbo', 5000, 'engine-turbo'),
(4, 'Electric', 8000, 'engine-electric');
