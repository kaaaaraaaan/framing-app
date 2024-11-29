import React from 'react';
import ImageUpload from '../components/ImageUpload';
import { Frame } from '../types';

const featuredFrames: Frame[] = [
  {
    id: 'rustic-barn-wood',
    name: 'Rustic Barn Wood',
    description: 'Weathered reclaimed wood frame with natural texture and warm tones',
    price: 2500,
    image: '/frames/rustic-barn-wood-frame.jpg'
  },
  {
    id: 'sleek-minimalist-black',
    name: 'Sleek Minimalist Black',
    description: 'Ultra-thin matte black frame for modern and contemporary spaces',
    price: 2200,
    image: '/frames/sleek-minimalist-black-frame.jpg'
  },
  {
    id: 'elegant-white-gallery',
    name: 'Elegant White Gallery',
    description: 'Clean white frame with subtle beveled edges, perfect for bright and airy interiors',
    price: 2000,
    image: '/frames/elegant-white-gallery-frame.jpg'
  }
];

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Custom Frame Your Memories
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-600">
            Transform your cherished photos into stunning wall art with our personalized framing service
          </p>
        </div>

        {/* Image Upload Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <ImageUpload />
        </div>

        {/* Featured Frames Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Explore Our Frame Styles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredFrames.map((frame) => (
              <div 
                key={frame.id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105"
              >
                <div className="aspect-w-16 aspect-h-10">
                  <img 
                    src={frame.image} 
                    alt={frame.name} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {frame.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {frame.description}
                  </p>
                  <div className="text-lg font-bold text-blue-600">
                    NPR {frame.price.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-5xl font-bold text-blue-600 mb-4">1</div>
              <h3 className="text-xl font-semibold mb-4">Upload Your Photo</h3>
              <p className="text-gray-600">
                Choose a high-quality photo that you want to frame
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-5xl font-bold text-blue-600 mb-4">2</div>
              <h3 className="text-xl font-semibold mb-4">Customize</h3>
              <p className="text-gray-600">
                Select your preferred frame style and size
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-5xl font-bold text-blue-600 mb-4">3</div>
              <h3 className="text-xl font-semibold mb-4">Checkout</h3>
              <p className="text-gray-600">
                Complete your order and we'll craft your custom frame
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
