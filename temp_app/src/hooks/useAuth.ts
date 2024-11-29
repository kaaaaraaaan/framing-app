import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Add any authentication state change listeners here if needed
  }, []);

  return { user, isAuthenticated };
}
