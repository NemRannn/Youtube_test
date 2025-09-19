
import React from 'react';
import type { StoryboardItem } from '../types';
import { ImageCard } from './ImageCard';

interface StoryboardPanelProps {
  storyboard: StoryboardItem[];
}

export const StoryboardPanel: React.FC<StoryboardPanelProps> = ({ storyboard }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {storyboard.map((item) => (
        <ImageCard key={item.id} item={item} />
      ))}
    </div>
  );
};
