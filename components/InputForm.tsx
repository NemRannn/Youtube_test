import React, { useState } from 'react';

interface InputFormProps {
  onGenerate: (prompt: string, numImages: number, generateVideo: boolean) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [numImages, setNumImages] = useState<number | ''>(5);
  const [generateVideo, setGenerateVideo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading && numImages && Number(numImages) > 0) {
      onGenerate(prompt, Number(numImages), generateVideo);
    }
  };

  const handleNumImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setNumImages('');
      return;
    }
    const num = Number(val);
    if (num >= 1 && num <= 20) {
      setNumImages(num);
    } else if (num > 20) {
      setNumImages(20);
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 md:p-8 shadow-2xl border border-gray-700/50">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
            Enter Topic or Paste Full Script
          </label>
          <textarea
            id="prompt"
            rows={6}
            className="w-full bg-gray-900/70 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 resize-y"
            placeholder="e.g., A brave knight goes on a quest to find a lost dragon..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="num-images" className="block text-sm font-medium text-gray-300 mb-2">
            Number of Images (1-20)
          </label>
          <input
            id="num-images"
            type="number"
            min="1"
            max="20"
            className="w-full bg-gray-900/70 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
            value={numImages}
            onChange={handleNumImagesChange}
            onBlur={() => {
              if (numImages === '' || Number(numImages) < 1) {
                setNumImages(1);
              }
            }}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center">
          <input
            id="generate-video"
            type="checkbox"
            checked={generateVideo}
            onChange={(e) => setGenerateVideo(e.target.checked)}
            disabled={isLoading}
            className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-purple-600 focus:ring-purple-500"
          />
          <label htmlFor="generate-video" className="ml-3 block text-sm font-medium text-gray-300">
            Generate Video from Images (Experimental, takes a few minutes)
          </label>
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !prompt.trim() || !numImages || Number(numImages) < 1}
            className="w-full flex justify-center items-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Images...
              </>
            ) : (
              'Generate Storyboard'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};