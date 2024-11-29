import React from 'react';
    import { Link } from 'react-router-dom';
    import { CheckCircle } from 'lucide-react';

    export default function UserCreated() {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="max-w-md w-full mx-auto text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Account Created Successfully!
            </h1>
            <p className="text-gray-600 mb-8">
              Thank you for signing up. You can now log in to your account.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </div>
        </div>
      );
    }
