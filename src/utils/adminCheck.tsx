import React from 'react';
import { User } from '@firebase/auth';
import { doc, getDoc } from '@firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Navigate } from 'react-router-dom';

// Function to check if the current user is an admin
export const isAdmin = async (user: User | null = auth.currentUser): Promise<boolean> => {
  if (!user) return false;

  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return false;
    }

    const userData = userDoc.data();
    return userData?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// Unauthorized Access Component
export const UnauthorizedAccess: React.FC = () => (
  <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Unauthorized Access</h2>
      <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
      <button
        onClick={() => window.history.back()}
        className="text-blue-600 hover:text-blue-800"
      >
        Go Back
      </button>
    </div>
  </div>
);

// Higher-order component for admin-only routes/components
export const withAdminAccess = (WrappedComponent: React.ComponentType) => {
  return function AdminProtectedComponent(props: any) {
    const [isAdminUser, setIsAdminUser] = React.useState<boolean | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
      const checkAdminStatus = async () => {
        const adminStatus = await isAdmin();
        setIsAdminUser(adminStatus);
        setIsLoading(false);
      };

      checkAdminStatus();
    }, []);

    if (isLoading) {
      return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!isAdminUser) {
      return <Navigate to="/admin/login" replace />;
    }

    return <WrappedComponent {...props} />;
  };
}
