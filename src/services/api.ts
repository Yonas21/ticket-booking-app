const API_URL = 'http://localhost:8080/api';

export interface Review {
  id: number;
  rating: number;
  comment: string;
  reviewer: string;
}

export interface Trip {
  id: number;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  seatsAvailable: number;
  busOperator: string;
  duration: string;
  amenities: string[];
  intermediateStops: string[];
  reviews: Review[];
  seats: string[];
  takenSeats: string[];
  originalPriceUSD: number; // Added for promo code calculation
  busImage: string; // Added for bus image display
}


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

export const searchTrips = async (from: string, to: string, date: string, flexibleDateRange: number, currency: string = 'ETB'): Promise<Trip[]> => {
  const params = new URLSearchParams({ from, to, date, flexibleDateRange: flexibleDateRange.toString(), currency });
  const response = await fetch(`${API_URL}/trips/search?${params}`);
  const results = await response.json();

  // Simulate dynamic pricing: adjust price slightly and convert to target currency
  if (!Array.isArray(results)) {
    console.warn("API returned non-array for searchTrips:", results);
    return []; // Return an empty array to prevent .map error
  }
  return results.map((trip: any) => {
    const priceUSD = parseFloat((trip.price * (1 + (Math.random() * 0.2 - 0.1))).toFixed(2));
    return {
      ...trip,
      price: getConvertedPrice(priceUSD, currency),
      originalPriceUSD: priceUSD,
      busImage: `/public/bus${Math.floor(Math.random() * 2) + 1}.jpg`, // Placeholder image
    };
  });
};

export const getTripById = async (id: string, currency: string = 'ETB'): Promise<Trip | null> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/trips/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const trip = await response.json();

  if (trip) {
    const simulatedTrip: Trip = { ...trip };
    const seatsToTake = Math.floor(Math.random() * 5); // Take up to 5 random seats
    const takenSeats: string[] = [];
    const allSeats: string[] = [...trip.seats]; // Start with all seats from the original trip

    for (let i = 0; i < seatsToTake; i++) {
      if (allSeats.length > 0) {
        const randomIndex = Math.floor(Math.random() * allSeats.length);
        takenSeats.push(allSeats.splice(randomIndex, 1)[0]);
      }
    }
    // The available seats are the ones not in takenSeats
    const availableSeats = trip.seats.filter((seat: string) => !takenSeats.includes(seat));

    simulatedTrip.seatsAvailable = availableSeats.length;
    simulatedTrip.seats = trip.seats; // All seats for rendering the layout
    simulatedTrip.takenSeats = takenSeats; // Store taken seats separately

    // Convert price to target currency
    simulatedTrip.price = getConvertedPrice(simulatedTrip.price, currency);
    simulatedTrip.originalPriceUSD = trip.price; // Store original USD price for reference
    simulatedTrip.busImage = `/public/bus${Math.floor(Math.random() * 2) + 1}.jpg`; // Placeholder image

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

export const createBooking = async (tripId: number, seats: string[], passengerName: string, passengerEmail: string) => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ trip_id: tripId, seats, passengerName, passengerEmail }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create booking');
  }

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
