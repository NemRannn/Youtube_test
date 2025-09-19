
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-6 border-b border-gray-700/50">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          AI Storyboard Generator
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Create consistent visual stories for your videos in minutes.
        </p>
      </div>
    </header>
  );
};
