import React, { useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { StoryboardPanel } from './components/StoryboardPanel';
import { Loader } from './components/Loader';
import { DownloadButton } from './components/DownloadButton';
import { VideoResult } from './components/VideoResult';
import { useStoryboardGenerator } from './hooks/useStoryboardGenerator';

const App: React.FC = () => {
  const { 
    storyboard, 
    isLoading, 
    loadingMessage, 
    error, 
    generateStoryboard,
    isGeneratingVideo,
    videoGenerationMessage,
    videoUrl,
    videoError
  } = useStoryboardGenerator();

  const handleGenerate = useCallback(async (prompt: string, numImages: number, generateVideo: boolean) => {
    await generateStoryboard(prompt, numImages, generateVideo);
  }, [generateStoryboard]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <InputForm onGenerate={handleGenerate} isLoading={isLoading || isGeneratingVideo} />

          {isLoading && <Loader message={loadingMessage} />}
          
          {error && <div className="mt-8 bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center">{error}</div>}

          {(isGeneratingVideo || videoUrl || videoError) && (
             <VideoResult 
                isLoading={isGeneratingVideo}
                message={videoGenerationMessage}
                videoUrl={videoUrl}
                error={videoError}
             />
          )}

          {storyboard.length > 0 && (
            <div className="mt-12">
              <div className="flex justify-center mb-8">
                <DownloadButton storyboard={storyboard} />
              </div>
              <StoryboardPanel storyboard={storyboard} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;