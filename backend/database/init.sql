CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    "from" VARCHAR(255) NOT NULL,
    "to" VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    "time" TIME NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    seats TEXT[] NOT NULL,
    seats_available INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    trip_id INTEGER REFERENCES trips(id),
    seats TEXT[] NOT NULL
);
