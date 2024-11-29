import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, LogIn } from 'lucide-react';

export default function RegisterSuccess() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Account Created Successfully!
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Thank you for joining FrameCraft. You can now sign in to your account.
        </p>
        <Link
          to="/login"
          className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <LogIn className="h-5 w-5 mr-2" />
          Sign In Now
        </Link>
      </div>
    </div>
  );
}