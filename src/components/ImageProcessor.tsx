import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

interface Props {
  onImageProcessed: (image: string) => void;
}

export default function ImageProcessor({ onImageProcessed }: Props) {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
    aspect: 4 / 3
  });
  const [error, setError] = useState<string | null>(null);

  const validateImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const minWidth = 1000;
        const minHeight = 750;
        if (img.width < minWidth || img.height < minHeight) {
          setError(`Image must be at least ${minWidth}x${minHeight} pixels for good print quality`);
          resolve(false);
          return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
          setError('Image size must be less than 10MB');
          resolve(false);
          return;
        }

        resolve(true);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setError(null);

    const isValid = await validateImage(file);
    if (!isValid) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  const cropImage = () => {
    if (!image) return;

    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = image;

    img.onload = () => {
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;

      const pixelCrop = {
        x: (crop.x * img.width * scaleX) / 100,
        y: (crop.y * img.height * scaleY) / 100,
        width: (crop.width * img.width * scaleX) / 100,
        height: (crop.height * img.height * scaleY) / 100
      };

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(
        img,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      onImageProcessed(canvas.toDataURL('image/jpeg', 0.9));
    };
  };

  if (!image) {
    return (
      <div className="space-y-4">
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-200 ease-in-out ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-25"></div>
                <div className="relative bg-white p-4 rounded-full">
                  <ImageIcon className="w-8 h-8 text-blue-500" />
                </div>
              </div>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {isDragActive ? "Drop your photo here" : "Upload your photo"}
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              {isDragActive
                ? "Release to upload"
                : "Drag & drop your photo here, or click to browse"}
            </p>
            <p className="text-xs text-gray-400">
              Supports JPG, JPEG, PNG (min 1000x750px, max 10MB)
            </p>
          </div>
        </div>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex items-center">
              <X className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative bg-gray-50 rounded-xl p-6 shadow-inner">
        <div className="max-w-3xl mx-auto">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={4/3}
            className="max-h-[600px] rounded-lg overflow-hidden"
            style={{
              '--ReactCrop-crop-color': '#3b82f6',
              '--ReactCrop-selection-color': 'rgba(59, 130, 246, 0.15)',
            } as React.CSSProperties}
          >
            <img
              src={image}
              alt="Upload preview"
              className="max-w-full h-auto"
            />
          </ReactCrop>
        </div>
        <div className="absolute top-4 right-4 space-x-2">
          <button
            onClick={() => setImage(null)}
            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            title="Cancel"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Drag the corners to adjust your crop
        </p>
        <div className="flex space-x-3">
          <button
            onClick={() => setImage(null)}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            onClick={cropImage}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
          >
            <Check className="w-4 h-4 mr-2" />
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}