import OpenAI from 'openai';
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage';
import { storage } from './firebase';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('VITE_OPENAI_API_KEY is not defined in environment variables');
}

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Note: In production, you might want to proxy these requests through your backend
});

async function saveImageToStorage(imageUrl: string, userId: string): Promise<string> {
  try {
    // Fetch the image from OpenAI URL
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // Create a reference to Firebase Storage
    const imageRef = ref(storage, `ai-generated/${userId}/${Date.now()}.png`);
    
    // Upload the image
    await uploadBytes(imageRef, blob);
    
    // Get the download URL
    const downloadUrl = await getDownloadURL(imageRef);
    return downloadUrl;
  } catch (error) {
    console.error('Error saving image to storage:', error);
    throw error;
  }
}

export async function generateImage(prompt: string, userId: string): Promise<string> {
  try {
    // Generate image using OpenAI
    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    });

    if (!response.data[0]?.url) {
      throw new Error('No image URL in response');
    }

    // Save the image to Firebase Storage
    const firebaseUrl = await saveImageToStorage(response.data[0].url, userId);
    return firebaseUrl;
  } catch (error) {
    console.error('Error in image generation process:', error);
    throw error;
  }
}
