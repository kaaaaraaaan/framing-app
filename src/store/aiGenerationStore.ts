import { create } from 'zustand';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from '@firebase/firestore';
import { db } from '../lib/firebase';
import { AIGeneration } from '../types';
import { generateImage } from '../lib/openai';

interface AIGenerationState {
  generations: AIGeneration[];
  currentGeneration: AIGeneration | null;
  loading: boolean;
  error: string | null;
  fetchGenerations: (userId: string) => Promise<void>;
  createGeneration: (data: Partial<AIGeneration>) => Promise<void>;
  generateImage: (prompt: string, userId: string) => Promise<void>;
  selectImageForFraming: (generation: AIGeneration) => void;
  setCurrentGeneration: (generation: AIGeneration | null) => void;
}

export const useAIGenerationStore = create<AIGenerationState>((set) => ({
  generations: [],
  currentGeneration: null,
  loading: false,
  error: null,

  fetchGenerations: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const generationsRef = collection(db, 'generations');
      const q = query(generationsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const generations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AIGeneration[];

      set({ generations, loading: false });
    } catch (error) {
      console.error('Error fetching generations:', error);
      set({ error: 'Failed to fetch generations', loading: false });
    }
  },

  createGeneration: async (data: Partial<AIGeneration>) => {
    set({ loading: true, error: null });
    try {
      const generationsRef = collection(db, 'generations');
      const docRef = await addDoc(generationsRef, {
        ...data,
        createdAt: new Date().toISOString(),
        status: 'pending'
      });

      const newGeneration = {
        id: docRef.id,
        ...data
      } as AIGeneration;

      set(state => ({
        generations: [...state.generations, newGeneration],
        currentGeneration: newGeneration,
        loading: false
      }));
    } catch (error) {
      console.error('Error creating generation:', error);
      set({ error: 'Failed to create generation', loading: false });
    }
  },

  generateImage: async (prompt: string, userId: string) => {
    set({ loading: true, error: null });
    try {
      // First create a pending generation
      const generationsRef = collection(db, 'generations');
      const docRef = await addDoc(generationsRef, {
        prompt,
        userId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        image_url: '',
        result: ''
      });

      const newGeneration = {
        id: docRef.id,
        prompt,
        userId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        image_url: '',
        result: ''
      } as AIGeneration;

      // Update state with pending generation
      set(state => ({
        generations: [newGeneration, ...state.generations],
        loading: true
      }));

      // Generate the image using OpenAI and save to Firebase Storage
      const imageUrl = await generateImage(prompt, userId);

      // Update the generation with the image URL
      const updatedGeneration = {
        ...newGeneration,
        status: 'completed',
        image_url: imageUrl,
        result: 'Generated successfully'
      };

      // Update Firestore
      await updateDoc(doc(db, 'generations', docRef.id), {
        status: 'completed',
        image_url: imageUrl,
        result: 'Generated successfully'
      });

      // Update local state
      set(state => ({
        generations: state.generations.map(gen =>
          gen.id === docRef.id ? updatedGeneration : gen
        ),
        loading: false
      }));

    } catch (error) {
      console.error('Error in generation process:', error);
      
      // Update Firestore with error status
      if (docRef?.id) {
        await updateDoc(doc(db, 'generations', docRef.id), {
          status: 'failed',
          result: error instanceof Error ? error.message : 'Failed to generate image'
        });
      }

      set(state => ({
        error: 'Failed to generate image. Please try again.',
        loading: false,
        generations: state.generations.map(gen =>
          gen.id === docRef?.id 
            ? { ...gen, status: 'failed', result: 'Failed to generate image' }
            : gen
        )
      }));
    }
  },

  selectImageForFraming: (generation: AIGeneration) => {
    set({ currentGeneration: generation });
  },

  setCurrentGeneration: (generation: AIGeneration | null) => set({ currentGeneration: generation })
}));
