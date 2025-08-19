import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as apiLogin, signup as apiSignup, getProfile as apiGetProfile } from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      currency: 'ETB',
      theme: 'light', // Add theme support
      
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setCurrency: (currency) => set({ currency }),
      setTheme: (theme) => set({ theme }), // Add theme setter
      
      login: (userData, token) => set({ user: userData, token }),
      
      logout: () => set({ user: null, token: null }),
      
      rehydrate: () => {
        // This will be called on app initialization
        const { theme } = get();
        // Apply theme to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      
      toggleTheme: () => {
        const { theme, setTheme } = get();
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        
        // Apply theme to document
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        currency: state.currency,
        theme: state.theme, // Persist theme
      }),
    }
  )
);

export default useAuthStore;
