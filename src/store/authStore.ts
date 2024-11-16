import { create } from 'zustand';
import { User } from '../types';
import { dbOperations } from '../db';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (credentials) => {
    // Check for admin login
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      const adminUser: User = {
        id: 'admin-1',
        email: 'admin@framecraft.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        address: '',
        city: '',
        state: '',
        zipCode: '',
      };
      set({ user: adminUser, isAuthenticated: true });
      return true;
    }

    // Check for vendor login
    const vendor = dbOperations.vendors.getByUsername(credentials.username);
    if (vendor && vendor.password === credentials.password && vendor.status === 'active') {
      const vendorUser: User = {
        id: vendor.id,
        email: vendor.email,
        firstName: vendor.firstName,
        lastName: vendor.lastName,
        role: 'vendor',
        address: vendor.address,
        city: vendor.city,
        state: vendor.state,
        zipCode: vendor.zipCode,
      };
      set({ user: vendorUser, isAuthenticated: true });
      return true;
    }

    // Check for regular user login
    const user = dbOperations.users.getByUsername(credentials.username);
    if (user && user.password === credentials.password) {
      set({ user, isAuthenticated: true });
      return true;
    }

    return false;
  },
  logout: () => set({ user: null, isAuthenticated: false }),
  updateProfile: (updates) =>
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...updates };
      dbOperations.users.update(updatedUser);
      return { user: updatedUser };
    }),
}));