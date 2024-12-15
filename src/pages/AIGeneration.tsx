import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAIGenerationStore } from '../store/aiGenerationStore';
import { useAuthStore } from '../store/authStore';
import { AIGeneration } from '../types';

export default function AIGenerationPage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const { user } = useAuthStore();
  const {
    generations,
    loading,
    error,
    generateImage,
    selectImageForFraming,
    fetchGenerations,
  } = useAIGenerationStore();

  useEffect(() => {
    if (user?.id) {
      fetchGenerations(user.id);
      // Set up polling for updates while loading
      let pollInterval: NodeJS.Timeout;
      
      if (loading) {
        pollInterval = setInterval(() => {
          fetchGenerations(user.id);
        }, 3000); // Poll every 3 seconds while loading
      }

      return () => {
        if (pollInterval) {
          clearInterval(pollInterval);
        }
      };
    }
  }, [fetchGenerations, user?.id, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }
    try {
      await generateImage(prompt.trim(), user.id);
      setPrompt('');
    } catch (err) {
      console.error('Generation error:', err);
    }
  };

  const handleSelectImage = (generation: AIGeneration) => {
    selectImageForFraming(generation);
    navigate('/customize');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Please sign in to generate images
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AI Image Generation</h1>

      {/* Generation Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="flex-1 p-2 border rounded"
            disabled={loading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading || !prompt.trim()}
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      {/* Generated Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {generations.map((generation) => (
          <div
            key={generation.id}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            {generation.image_url ? (
              <img
                src={generation.image_url}
                alt={generation.prompt}
                className="w-full h-48 object-cover rounded mb-4"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded mb-4">
                {generation.status === 'pending' ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p>Generating...</p>
                  </div>
                ) : (
                  'Failed'
                )}
              </div>
            )}
            <p className="text-sm text-gray-600 mb-4">{generation.prompt}</p>
            {generation.image_url && (
              <button
                onClick={() => handleSelectImage(generation)}
                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Use This Frame
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
