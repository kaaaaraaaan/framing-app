import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Frame, Size } from '../types';
import { frames, sizes } from '../data/frames';
import ImageProcessor from '../components/ImageProcessor';
import FramePreview from '../components/FramePreview';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [selectedFrame, setSelectedFrame] = useState<Frame>(frames[0]);
  const [selectedSize, setSelectedSize] = useState<Size>(sizes[0]);

  const handleCheckout = () => {
    navigate('/checkout', {
      state: {
        image: uploadedImage,
        frame: selectedFrame,
        size: selectedSize,
        totalPrice: selectedFrame.price * selectedSize.priceMultiplier
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Custom Frame Your Memories
        </h1>
        <p className="text-xl text-gray-600">
          Transform your photos into beautiful wall art
        </p>
      </div>

      {!uploadedImage ? (
        <div className="max-w-2xl mx-auto">
          <ImageProcessor onImageProcessed={setUploadedImage} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <FramePreview
              uploadedImage={uploadedImage}
              selectedFrame={selectedFrame}
              selectedSize={selectedSize}
            />
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Choose Your Frame
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {frames.map((frame) => (
                  <button
                    key={frame.id}
                    onClick={() => setSelectedFrame(frame)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedFrame.id === frame.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    <img
                      src={frame.image}
                      alt={frame.name}
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                    <p className="font-medium text-gray-900">{frame.name}</p>
                    <p className="text-gray-500">NPR {frame.price.toLocaleString()}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Select Size
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedSize.id === size.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    <p className="font-medium text-gray-900">{size.name}</p>
                    <p className="text-gray-500">{size.dimensions}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-4 px-8 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-center mt-2 text-gray-500">
                Total: NPR {(selectedFrame.price * selectedSize.priceMultiplier).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
