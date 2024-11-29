import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';

export default function ImageUpload() {
  const navigate = useNavigate();
  const { setUploadedImage } = useImageStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result as string;
      setUploadedImage(imageData);
      navigate('/customize');
    };
    reader.readAsDataURL(file);
  }, [navigate, setUploadedImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    maxFiles: 1
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 transition-colors"
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-lg text-gray-600">
          {isDragActive
            ? "Drop your photo here..."
            : "Drag & drop your photo here, or click to select"}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Supports all image formats
        </p>
      </div>
    </div>
  );
}
