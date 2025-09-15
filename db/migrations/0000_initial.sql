-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create biomarker_records table
CREATE TABLE IF NOT EXISTS biomarker_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    fluid_type TEXT NOT NULL,
    biomarkers JSONB NOT NULL,
    predictions JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create diseases table
CREATE TABLE IF NOT EXISTS diseases (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    fluid_type TEXT NOT NULL,
    description TEXT NOT NULL,
    key_biomarkers JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
); 