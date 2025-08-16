DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    "from" VARCHAR(255) NOT NULL,
    "to" VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    seats_available INTEGER NOT NULL,
    bus_operator VARCHAR(255) NOT NULL,
    duration VARCHAR(255) NOT NULL,
    amenities TEXT[] NOT NULL,
    intermediate_stops TEXT[] NOT NULL,
    reviews JSONB NOT NULL,
    seats TEXT[]
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    trip_id INTEGER REFERENCES trips(id),
    seats TEXT[] NOT NULL
);

INSERT INTO trips ("from", "to", date, departure_time, arrival_time, price, seats_available, bus_operator, duration, amenities, intermediate_stops, reviews, seats) VALUES
('Addis Ababa', 'Adama', '2025-08-16', '08:00:00', '09:30:00', 150.00, 40, 'Selam Bus', '1h 30m', ARRAY['WiFi', 'AC'], ARRAY['Bishoftu'], '[{"rating": 5, "comment": "Great trip!"}]', ARRAY['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4', 'D1', 'D2', 'D3', 'D4', 'E1', 'E2', 'E3', 'E4', 'F1', 'F2', 'F3', 'F4', 'G1', 'G2', 'G3', 'G4', 'H1', 'H2', 'H3', 'H4', 'I1', 'I2', 'I3', 'I4', 'J1', 'J2', 'J3', 'J4']),
('Addis Ababa', 'Hawassa', '2025-08-17', '10:00:00', '13:00:00', 300.00, 30, 'Sky Bus', '3h 0m', ARRAY['AC'], ARRAY['Mojo'], '[{"rating": 4, "comment": "Comfortable journey."}]', ARRAY['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4', 'D1', 'D2', 'D3', 'D4', 'E1', 'E2', 'E3', 'E4', 'F1', 'F2', 'F3', 'F4', 'G1', 'G2', 'G3', 'G4', 'H1', 'H2', 'H3', 'H4', 'I1', 'I2', 'I3', 'I4', 'J1', 'J2', 'J3', 'J4']);
