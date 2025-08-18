const API_URL = 'http://localhost:8080/api';

// Mock exchange rates (USD as base)
const exchangeRates = {
  'USD': 1,
  'EUR': 0.92, // 1 USD = 0.92 EUR
  'GBP': 0.79, // 1 USD = 0.79 GBP
  'ETB': 140.50, // 1 USD = 140.50 ETB
};

const getConvertedPrice = (priceUSD, targetCurrency) => {
  const rate = exchangeRates[targetCurrency] || 1; // Default to 1 if currency not found
  return (priceUSD * rate).toFixed(2);
};

export const searchTrips = async (from, to, date, flexibleDateRange, currency = 'ETB') => {
  const params = new URLSearchParams({ from, to, date, flexibleDateRange, currency });
  const response = await fetch(`${API_URL}/trips/search?${params}`);
  const results = await response.json();

  // Simulate dynamic pricing: adjust price slightly and convert to target currency
  return results.map(trip => {
    const priceUSD = parseFloat((trip.price * (1 + (Math.random() * 0.2 - 0.1))).toFixed(2));
    return {
      ...trip,
      price: getConvertedPrice(priceUSD, currency),
      originalPriceUSD: priceUSD, // Keep original USD price for reference
    };
  });
};

export const getTripById = async (id, currency = 'ETB') => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/trips/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const trip = await response.json();

  if (trip) {
    // Simulate real-time seat availability: randomly reduce seats available and mark some as taken
    const simulatedTrip = { ...trip };
    const seatsToTake = Math.floor(Math.random() * 5); // Take up to 5 random seats
    const takenSeats = [];
    const availableSeats = [...simulatedTrip.seats]; // Start with all seats from the original trip

    for (let i = 0; i < seatsToTake; i++) {
      if (availableSeats.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableSeats.length);
        takenSeats.push(availableSeats.splice(randomIndex, 1)[0]);
      }
    }
    simulatedTrip.seatsAvailable = availableSeats.length;
    simulatedTrip.seats = availableSeats; // Update the seats array to only include available ones
    simulatedTrip.takenSeats = takenSeats; // Store taken seats separately

    // Convert price to target currency
    simulatedTrip.price = getConvertedPrice(simulatedTrip.price, currency);
    simulatedTrip.originalPriceUSD = trip.price; // Store original USD price for reference

    return simulatedTrip;
  } else {
    return null;
  }
};

export const signup = async (name, email, password) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });
  return response.json();
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const createBooking = async (tripId, seats) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ trip_id: tripId, seats }),
  });
  return response.json();
};

export const getProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};
