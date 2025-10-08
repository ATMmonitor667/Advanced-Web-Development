CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample users
INSERT INTO users (username, email, password)
VALUES
('alice', 'alice@example.com', 'hashed_password1'),
('bob', 'bob@example.com', 'hashed_password2'),
('charlie', 'charlie@example.com', 'hashed_password3');