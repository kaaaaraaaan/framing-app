import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, User, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { isAdmin } from '../utils/adminCheck';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const adminStatus = await isAdmin();
        setIsAdminUser(adminStatus);
      }
    };
    checkAdminStatus();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-800">
                FrameCraft
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Shop
              </Link>
              <Link
                to="/ai-generation"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                AI Generation
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                <Link
                  to="/cart"
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <ShoppingCart className="h-6 w-6" />
                </Link>
                <div className="ml-3 relative flex items-center space-x-4">
                  <Link
                    to={isAdminUser ? "/admin" : "/profile"}
                    className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    <User className="h-5 w-5 mr-1" />
                    {user.firstName}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
