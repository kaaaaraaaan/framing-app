import React from 'react';
    import { Frame, Size } from '../types';

    interface Props {
      uploadedImage: string;
      selectedFrame: Frame;
      selectedSize: Size;
    }

    export default function FramePreview({ uploadedImage, selectedFrame, selectedSize }: Props) {
      // Calculate frame dimensions based on size
      const getFrameDimensions = () => {
        const [width] = selectedSize.dimensions.split('x').map(d => parseInt(d));
        // Scale down larger frames for preview
        const scale = width > 16 ? 0.4 : 0.5;
        return {
          width: `${width * scale}rem`,
          height: `${(width * 1.25) * scale}rem`
        };
      };

      const dimensions = getFrameDimensions();

      return (
        <div className="relative w-full">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
            {/* Plain gray wall background */}
            <div 
              className="absolute inset-0 bg-gray-200"
            />
            
            {/* Shadow on wall */}
            <div 
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                width: dimensions.width,
                height: dimensions.height,
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
              }}
            />

            {/* Framed photo */}
            <div 
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white"
              style={{
                width: dimensions.width,
                height: dimensions.height,
                padding: '0.5rem',
                border: `1rem solid`,
                borderImage: `url(${selectedFrame.image}) 30 stretch`,
                boxShadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
              }}
            >
              <div className="w-full h-full overflow-hidden">
                <img
                  src={uploadedImage}
                  alt="Your framed photo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-lg font-medium text-gray-900">
              {selectedFrame.name} Frame
            </p>
            <p className="text-sm text-gray-500">
              Size: {selectedSize.dimensions}
            </p>
            <p className="mt-2 text-lg font-bold text-blue-600">
              NPR {(selectedFrame.price * selectedSize.priceMultiplier).toLocaleString()}
            </p>
          </div>
        </div>
      );
    }
