import { create } from 'zustand';
import { User } from '../types';
import { supabase } from '../lib/supabase';

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
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          firstName: profile?.first_name || '',
          lastName: profile?.last_name || '',
          address: profile?.address || '',
          city: profile?.city || '',
          state: profile?.state || '',
          zipCode: profile?.zip_code || '',
          role: profile?.role || 'user',
        };

        set({ user, isAuthenticated: true });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },
  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  updateProfile: async (updates) => {
    try {
      const { user } = useAuthStore.getState();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: updates.firstName,
          last_name: updates.lastName,
          address: updates.address,
          city: updates.city,
          state: updates.state,
          zip_code: updates.zipCode,
        })
        .eq('id', user.id);

      if (error) throw error;

      set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      }));
    } catch (error) {
      console.error('Update profile error:', error);
    }
  },
}));