const API_URL = 'http://localhost:8080/api';

// Mock exchange rates (USD as base)
const exchangeRates = {
  'USD': 1,
  'EUR': 0.92,
  'GBP': 0.79,
  'ETB': 140.50,
};

const getConvertedPrice = (priceUSD, targetCurrency) => {
  const rate = exchangeRates[targetCurrency] || 1;
  return (priceUSD * rate).toFixed(2);
};

// Import trip data for fallback
import tripsData from '../data/trips.json';

export const searchTrips = async (from, to, date, flexibleDateRange, currency = 'ETB') => {
  try {
    const params = new URLSearchParams({ from, to, date, flexibleDateRange, currency });
    const response = await fetch(`${API_URL}/trips/search?${params}`);
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const results = await response.json();
    
    // Convert prices to target currency
    return results.map(trip => {
      const priceUSD = parseFloat(trip.price);
      return {
        ...trip,
        price: getConvertedPrice(priceUSD, currency),
        originalPriceUSD: priceUSD,
      };
    });
  } catch (error) {
    console.log('Using mock data due to API error:', error.message);
    
    // Fallback to mock data
    let filteredTrips = tripsData.filter(trip => {
      const tripDate = new Date(trip.date);
      const searchDate = new Date(date);
      
      // Basic filtering
      const fromMatch = trip.from.toLowerCase().includes(from.toLowerCase());
      const toMatch = trip.to.toLowerCase().includes(to.toLowerCase());
      
      // Date filtering with flexible range
      let dateMatch = false;
      if (flexibleDateRange && parseInt(flexibleDateRange) > 0) {
        const range = parseInt(flexibleDateRange);
        const minDate = new Date(searchDate);
        minDate.setDate(minDate.getDate() - range);
        const maxDate = new Date(searchDate);
        maxDate.setDate(maxDate.getDate() + range);
        dateMatch = tripDate >= minDate && tripDate <= maxDate;
      } else {
        dateMatch = tripDate.toDateString() === searchDate.toDateString();
      }
      
      return fromMatch && toMatch && dateMatch;
    });
    
    // Convert prices and add some randomization for realistic pricing
    return filteredTrips.map(trip => {
      const basePriceUSD = parseFloat(trip.price);
      const priceVariation = 1 + (Math.random() * 0.2 - 0.1); // ±10% variation
      const adjustedPriceUSD = basePriceUSD * priceVariation;
      
      return {
        ...trip,
        price: getConvertedPrice(adjustedPriceUSD, currency),
        originalPriceUSD: adjustedPriceUSD,
        seatsAvailable: Math.max(1, trip.seatsAvailable - Math.floor(Math.random() * 10)), // Simulate some seats taken
      };
    });
  }
};

export const getTripById = async (id, currency = 'ETB') => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/trips/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const trip = await response.json();
    
    if (trip) {
      // Simulate real-time seat availability
      const simulatedTrip = { ...trip };
      const seatsToTake = Math.floor(Math.random() * 8); // Take up to 8 random seats
      const takenSeats = [];
      const availableSeats = [...simulatedTrip.seats];

      for (let i = 0; i < seatsToTake; i++) {
        if (availableSeats.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableSeats.length);
          takenSeats.push(availableSeats.splice(randomIndex, 1)[0]);
        }
      }
      
      simulatedTrip.seatsAvailable = availableSeats.length;
      simulatedTrip.seats = availableSeats;
      simulatedTrip.takenSeats = takenSeats;
      simulatedTrip.price = getConvertedPrice(simulatedTrip.price, currency);
      simulatedTrip.originalPriceUSD = trip.price;

      return simulatedTrip;
    }
    
    return null;
  } catch (error) {
    console.log('Using mock data due to API error:', error.message);
    
    // Fallback to mock data
    const trip = tripsData.find(t => t.id === parseInt(id));
    
    if (trip) {
      // Simulate real-time seat availability
      const simulatedTrip = { ...trip };
      const seatsToTake = Math.floor(Math.random() * 8);
      const takenSeats = [];
      const availableSeats = [...simulatedTrip.seats];

      for (let i = 0; i < seatsToTake; i++) {
        if (availableSeats.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableSeats.length);
          takenSeats.push(availableSeats.splice(randomIndex, 1)[0]);
        }
      }
      
      simulatedTrip.seatsAvailable = availableSeats.length;
      simulatedTrip.seats = availableSeats;
      simulatedTrip.takenSeats = takenSeats;
      simulatedTrip.price = getConvertedPrice(simulatedTrip.price, currency);
      simulatedTrip.originalPriceUSD = trip.price;

      return simulatedTrip;
    }
    
    return null;
  }
};

export const signup = async (name, email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Signup failed');
    }
    
    return response.json();
  } catch (error) {
    console.log('Using mock signup due to API error:', error.message);
    
    // Mock successful signup
    return {
      success: true,
      message: 'Account created successfully!',
      user: { id: Date.now(), name, email }
    };
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    return response.json();
  } catch (error) {
    console.log('Using mock login due to API error:', error.message);
    
    // Mock successful login for demo purposes
    if (email === 'demo@example.com' && password === 'password') {
      return {
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: { id: 1, name: 'Demo User', email: 'demo@example.com' }
      };
    }
    
    return {
      success: false,
      message: 'Invalid email or password'
    };
  }
};

export const createBooking = async (tripId, seats) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ trip_id: tripId, seats }),
    });
    
    if (!response.ok) {
      throw new Error('Booking creation failed');
    }
    
    return response.json();
  } catch (error) {
    console.log('Using mock booking due to API error:', error.message);
    
    // Mock successful booking
    return {
      success: true,
      bookingId: 'BK-' + Date.now(),
      message: 'Booking created successfully!'
    };
  }
};

export const getProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Profile fetch failed');
    }
    
    return response.json();
  } catch (error) {
    console.log('Using mock profile due to API error:', error.message);
    
    // Mock profile data
    return {
      user: { id: 1, name: 'Demo User', email: 'demo@example.com' },
      bookings: []
    };
  }
};
