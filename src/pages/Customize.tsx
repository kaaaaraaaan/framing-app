import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';

const sizes = [
  { id: 'small', name: 'Small', dimensions: '8" x 10"', price: 1500 },
  { id: 'medium', name: 'Medium', dimensions: '11" x 14"', price: 2000 },
  { id: 'large', name: 'Large', dimensions: '16" x 20"', price: 2500 },
  { id: 'xlarge', name: 'Extra Large', dimensions: '20" x 24"', price: 3000 },
];

const frames = [
  {
    id: 'classic',
    name: 'Classic Wood',
    description: 'Traditional wooden frame with a timeless design',
    price: 2000,
    image: '/frames/classic.jpg'
  },
  {
    id: 'modern',
    name: 'Modern Black',
    description: 'Sleek black aluminum frame for a contemporary look',
    price: 2500,
    image: '/frames/modern.jpg'
  },
  {
    id: 'ornate',
    name: 'Ornate Gold',
    description: 'Elegant gold-finished frame with intricate details',
    price: 3000,
    image: '/frames/ornate.jpg'
  },
  {
    id: 'minimalist',
    name: 'Minimalist White',
    description: 'Clean and simple white frame for a minimalist aesthetic',
    price: 1800,
    image: '/frames/minimalist.jpg'
  }
];

export default function Customize() {
  const navigate = useNavigate();
  const { uploadedImage } = useImageStore();
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [selectedFrame, setSelectedFrame] = useState(frames[0]);

  const handleProceedToCheckout = () => {
    // Here you would typically save the selections to your app state
    navigate('/checkout');
  };

  if (!uploadedImage) {
    navigate('/');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Preview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={uploadedImage}
              alt="Your uploaded photo"
              className="object-contain"
            />
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            Selected Size: {selectedSize.dimensions}
          </div>
        </div>

        {/* Right Column - Customization Options */}
        <div className="space-y-8">
          {/* Frame Selection */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Choose Frame</h2>
            <div className="grid grid-cols-2 gap-4">
              {frames.map((frame) => (
                <div
                  key={frame.id}
                  onClick={() => setSelectedFrame(frame)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedFrame.id === frame.id
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="aspect-w-1 aspect-h-1 mb-2">
                    <img
                      src={frame.image}
                      alt={frame.name}
                      className="object-cover rounded"
                    />
                  </div>
                  <h3 className="font-medium">{frame.name}</h3>
                  <p className="text-sm text-gray-600">{frame.description}</p>
                  <p className="mt-2 font-semibold">
                    NPR {frame.price.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Choose Size</h2>
            <div className="grid grid-cols-2 gap-4">
              {sizes.map((size) => (
                <div
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedSize.id === size.id
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <h3 className="font-medium">{size.name}</h3>
                  <p className="text-sm text-gray-600">{size.dimensions}</p>
                  <p className="mt-2 font-semibold">
                    NPR {size.price.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total and Checkout */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">Total Price:</span>
              <span className="text-2xl font-bold">
                NPR {(selectedSize.price + selectedFrame.price).toLocaleString()}
              </span>
            </div>
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
