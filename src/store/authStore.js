import { create } from 'zustand';
import users from '../data/users.json';

const useAuthStore = create((set) => ({
  user: null,
  currency: 'USD', // Default currency
  login: (email, password) => {
    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );
    if (foundUser) {
      set({ user: { name: foundUser.name, email: foundUser.email, bookings: [], preferredLocations: [] } });
      return true;
    }
    return false;
  },
  logout: () => set({ user: null }),
  signup: (name, email, password) => {
    console.log(`New user signed up: ${name} (${email})`);
    const newUser = { name, email, bookings: [], preferredLocations: [] };
    set({ user: newUser });
  },
  addBooking: (booking) => {
    set((state) => {
      const updatedBookings = [...state.user.bookings, booking];
      const updatedPreferredLocations = [...new Set([...state.user.preferredLocations, booking.from])];
      return {
        user: {
          ...state.user,
          bookings: updatedBookings,
          preferredLocations: updatedPreferredLocations,
        },
      };
    });
  },
  setCurrency: (currency) => set({ currency }),
}));

export default useAuthStore;