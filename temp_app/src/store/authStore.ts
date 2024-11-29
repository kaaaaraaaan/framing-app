import { create } from 'zustand';
  import { User } from '../types';

  interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (credentials: { email: string; password: string }) => Promise<boolean>;
    logout: () => Promise<void>;
    updateProfile: (updates: Partial<User>) => Promise<void>;
  }

  export const useAuthStore = create<AuthState>()((set) => ({
    user: null,
    isAuthenticated: false,
    login: async (credentials) => {
      // Mock login for demonstration
      const user: User = {
        id: '1',
        email: credentials.email,
        firstName: 'John',
        lastName: 'Doe',
        address: '',
        city: '',
        state: '',
        zipCode: '',
      };
      set({ user, isAuthenticated: true });
      return true;
    },
    logout: async () => {
      set({ user: null, isAuthenticated: false });
    },
    updateProfile: async (updates) => {
      set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      }));
    },
  }));
