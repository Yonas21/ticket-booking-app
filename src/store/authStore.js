import { create } from 'zustand';
import { login as apiLogin, signup as apiSignup, getProfile as apiGetProfile } from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  currency: 'USD', // Default currency
  rehydrate: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const profile = await apiGetProfile();
        if (profile) {
          set({ user: profile });
        }
      } catch (error) {
        console.error("Failed to rehydrate auth state:", error);
        localStorage.removeItem('token');
      }
    }
  },
  login: async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      if (response.token) {
        localStorage.setItem('token', response.token);
        set({ user: { email: email, name: response.name, bookings: [], preferredLocations: [] } }); // Assuming name is returned
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null });
  },
  signup: async (name, email, password) => {
    try {
      const response = await apiSignup(name, email, password);
      if (response.message === "User registered successfully") {
        // Optionally log in the user directly after signup
        // await useAuthStore.getState().login(email, password);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
    }
    },
  setUser: (userData) => set({ user: userData }),
  setCurrency: (currency) => set({ currency }),
}));

export default useAuthStore;
