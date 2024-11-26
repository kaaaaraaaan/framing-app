import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout } = useAuthStore();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        await logout();
        navigate('/login');
      } else if (event === 'SIGNED_IN' && session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          await login({
            email: session.user.email!,
            password: '', // Password is not needed here as we're already authenticated
          });
        }
      }
    });
  }, []);

  return { user, isAuthenticated, login, logout };
}