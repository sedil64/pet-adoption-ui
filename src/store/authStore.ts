import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState } from '../types/auth.types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isAdmin: false,

      login: (token, user) => set({ 
        token, 
        user, 
        isAuthenticated: true, 
        isAdmin: user.is_staff 
      }),

      logout: () => set({ 
        token: null, 
        user: null, 
        isAuthenticated: false, 
        isAdmin: false 
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
);