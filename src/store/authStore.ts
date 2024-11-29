import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  },

  login: async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('No user returned from Supabase');
      }

      // Check if user is admin
      if (data.user.email === import.meta.env.VITE_ADMIN_EMAIL) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
          },
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }

      // For regular users, fetch from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) {
        throw new Error(userError.message);
      }

      set({
        user: {
          id: userData.id,
          email: userData.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
          role: 'user',
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async ({ email, password, firstName, lastName }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('No user returned from Supabase');
      }

      const { error: profileError } = await supabase.from('users').insert([
        {
          id: data.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
        },
      ]);

      if (profileError) {
        throw new Error(profileError.message);
      }

      set({
        user: {
          id: data.user.id,
          email,
          firstName,
          lastName,
          role: 'user',
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  updateProfile: async (updates) => {
    if (!updates || Object.keys(updates).length === 0) {
      return;
    }

    const { error } = await supabase
      .from('users')
      .update({
        first_name: updates.firstName,
        last_name: updates.lastName,
      })
      .eq('id', updates.id);

    if (error) {
      throw new Error(error.message);
    }

    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }));
  },
}));
