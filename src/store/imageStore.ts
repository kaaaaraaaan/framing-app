import { create } from 'zustand';

interface ImageState {
  uploadedImage: string | null;
  setUploadedImage: (image: string | null) => void;
}

export const useImageStore = create<ImageState>((set) => ({
  uploadedImage: null,
  setUploadedImage: (image) => set({ uploadedImage: image }),
}));
