
import React from 'react';
import type { StoryboardItem } from '../types';

interface ImageCardProps {
  item: StoryboardItem;
}

export const ImageCard: React.FC<ImageCardProps> = ({ item }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700/50 flex flex-col group transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-purple-500/20">
      <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
        {item.imageBase64 ? (
          <img
            src={`data:image/png;base64,${item.imageBase64}`}
            alt={`Storyboard scene ${item.id}`}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-600 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
          {item.id}
        </div>
      </div>
      <div className="p-4 flex-grow">
        <p className="text-gray-300 text-sm italic">"{item.voiceoverScript}"</p>
      </div>
    </div>
  );
};
