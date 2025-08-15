import tripsData from '../data/trips.json';

// Mock exchange rates (USD as base)
const exchangeRates = {
  'USD': 1,
  'EUR': 0.92, // 1 USD = 0.92 EUR
  'GBP': 0.79, // 1 USD = 0.79 GBP
};

const getConvertedPrice = (priceUSD, targetCurrency) => {
  const rate = exchangeRates[targetCurrency] || 1; // Default to 1 if currency not found
  return (priceUSD * rate).toFixed(2);
};

export const searchTrips = (from, to, date, flexibleDateRange, currency = 'USD') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let results = tripsData.filter(
        (trip) => trip.from === from && trip.to === to
      );

      if (date) {
        const searchDate = new Date(date);
        results = results.filter(trip => {
          const tripDate = new Date(trip.date);
          if (flexibleDateRange) {
            const range = parseInt(flexibleDateRange, 10);
            const minDate = new Date(searchDate);
            minDate.setDate(searchDate.getDate() - range);
            const maxDate = new Date(searchDate);
            maxDate.setDate(searchDate.getDate() + range);
            return tripDate >= minDate && tripDate <= maxDate;
          } else {
            return trip.date === date;
          }
        });
      }

      // Simulate dynamic pricing: adjust price slightly and convert to target currency
      results = results.map(trip => {
        const priceUSD = parseFloat((trip.price * (1 + (Math.random() * 0.2 - 0.1))).toFixed(2));
        return {
          ...trip,
          price: getConvertedPrice(priceUSD, currency),
          originalPriceUSD: priceUSD, // Keep original USD price for reference
        };
      });

      resolve(results);
    }, 500); // Simulate network delay
  });
};

export const getTripById = (id, currency = 'USD') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const trip = tripsData.find((t) => t.id === parseInt(id));
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

        resolve(simulatedTrip);
      } else {
        resolve(null);
      }
    }, 200); // Simulate network delay
  });
};