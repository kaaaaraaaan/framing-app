import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuthStore();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error);
        return;
      }

      if (session?.user) {
        // Check if user is admin
        if (session.user.email === import.meta.env.VITE_ADMIN_EMAIL) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
          });
          return;
        }

        // For regular users, fetch from users table
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: userData, error: userError }) => {
            if (userError) {
              console.error('User data error:', userError);
              return;
            }

            if (userData) {
              setUser({
                id: userData.id,
                email: userData.email,
                firstName: userData.first_name,
                lastName: userData.last_name,
                role: 'user',
              });
            }
          });
      } else {
        setUser(null);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        return;
      }

      if (session?.user) {
        // Check if user is admin
        if (session.user.email === import.meta.env.VITE_ADMIN_EMAIL) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
          });
          return;
        }

        // For regular users, fetch from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError) {
          console.error('User data error:', userError);
          return;
        }

        if (userData) {
          setUser({
            id: userData.id,
            email: userData.email,
            firstName: userData.first_name,
            lastName: userData.last_name,
            role: 'user',
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  return <>{children}</>;
}
