import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Frame, Image, User, ShoppingBag, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Header() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Don't show header in admin login page
  if (location.pathname === '/admin/login') {
    return null;
  }

  // Show minimal header in admin routes
  if (isAdminRoute) {
    return (
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/admin" className="flex items-center space-x-2">
              <Frame className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">FrameCraft Admin</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <button className="flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                  <User className="h-5 w-5" />
                  <span>Admin</span>
                </button>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Frame className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">FrameCraft</span>
          </Link>
          
          <nav className="flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 text-sm font-medium ${
                location.pathname === '/'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Image className="h-5 w-5" />
              <span>Frame Your Photo</span>
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                {!isAdmin && (
                  <Link
                    to="/orders"
                    className="flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <span>My Orders</span>
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                    <User className="h-5 w-5" />
                    <span>{user?.firstName}</span>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create Account
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}