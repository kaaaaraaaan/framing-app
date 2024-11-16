import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function Success() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-auto px-4 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Order Successful!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. We'll send you an email confirmation with tracking details shortly.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Frame Another Photo
        </button>
      </div>
    </div>
  );
}