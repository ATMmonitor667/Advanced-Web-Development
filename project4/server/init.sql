DROP TABLE IF EXISTS item_selections CASCADE;
DROP TABLE IF EXISTS options CASCADE;
DROP TABLE IF EXISTS features CASCADE;
DROP TABLE IF EXISTS custom_items CASCADE;

CREATE TABLE custom_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE features (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    feature_id INT NOT NULL REFERENCES features(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    icon_class VARCHAR(100),
    UNIQUE(feature_id, name)
);

CREATE TABLE item_selections (
    id SERIAL PRIMARY KEY,
    custom_item_id INT NOT NULL REFERENCES custom_items(id) ON DELETE CASCADE,
    feature_id INT NOT NULL REFERENCES features(id),
    option_id INT NOT NULL REFERENCES options(id),
    UNIQUE(custom_item_id, feature_id)
);

INSERT INTO features (name, description) VALUES
('Exterior Color', 'Paint and exterior finish'),
('Wheels', 'Wheel package and style'),
('Interior', 'Cabin material and trim'),
('Engine', 'Performance and powertrain');

INSERT INTO options (feature_id, name, price, icon_class) VALUES
(1, 'Red', 0, 'color-red'),
(1, 'Blue', 500, 'color-blue'),
(1, 'Black', 1000, 'color-black'),
(1, 'Silver', 1500, 'color-silver'),

(2, 'Standard', 0, 'wheels-standard'),
(2, 'Sport', 2000, 'wheels-sport'),
(2, 'Luxury', 4000, 'wheels-luxury'),

(3, 'Cloth', 0, 'interior-cloth'),
(3, 'Leather', 3000, 'interior-leather'),
(3, 'Premium Leather', 5000, 'interior-premium'),

(4, 'Standard', 0, 'engine-standard'),
(4, 'Turbo', 5000, 'engine-turbo'),
(4, 'Electric', 8000, 'engine-electric');

INSERT INTO custom_items (name, total_price) VALUES
('City Current', 12500),
('Track Ember', 10000);

INSERT INTO item_selections (custom_item_id, feature_id, option_id) VALUES
(1, 1, 2),
(1, 2, 7),
(1, 3, 10),
(1, 4, 13),
(2, 1, 1),
(2, 2, 6),
(2, 3, 9),
(2, 4, 12);
