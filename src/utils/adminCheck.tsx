import React from 'react';
import { createClient } from '@supabase/supabase-js';

// Function to check if the current user is an admin
export const isAdmin = async () => {
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL, 
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  try {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) return false;

    // Replace with your actual admin email
    const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
    
    return user.email === ADMIN_EMAIL;
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
}

// Unauthorized Access Component
export const UnauthorizedAccess: React.FC = () => (
  <div className="flex justify-center items-center h-screen">
    <p className="text-red-500 text-xl">Unauthorized Access</p>
  </div>
);

// Higher-order component for admin-only routes/components
export const withAdminAccess = (WrappedComponent: React.ComponentType) => {
  return async (props: any) => {
    const admin = await isAdmin();

    if (!admin) {
      return <UnauthorizedAccess />;
    }

    return <WrappedComponent {...props} />;
  };
}
