import { create } from 'zustand';

interface ImageState {
  uploadedImage: File | string | null;
  setUploadedImage: (image: File | string | null) => void;
}

export const useImageStore = create<ImageState>((set) => ({
  uploadedImage: null,
  setUploadedImage: (image) => set({ uploadedImage: image }),
}));
