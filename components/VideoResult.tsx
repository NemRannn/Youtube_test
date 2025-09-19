import React from 'react';

interface VideoResultProps {
  isLoading: boolean;
  message: string;
  videoUrl: string | null;
  error: string | null;
}

export const VideoResult: React.FC<VideoResultProps> = ({ isLoading, message, videoUrl, error }) => {
  const handleDownload = () => {
    if (videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = 'ai_storyboard_video.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Video Result</h2>
      <div className="bg-gray-800/50 rounded-xl p-6 md:p-8 shadow-2xl border border-gray-700/50">
        {isLoading && (
          <div className="text-center">
             <div className="flex items-center justify-center mb-4">
                <svg className="animate-spin h-8 w-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            <p className="text-lg font-medium text-gray-300">{message}</p>
            <p className="text-sm text-gray-500 mt-1">This process is resource-intensive and may take several minutes. Please do not close this tab.</p>
          </div>
        )}
        {error && <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center">{error}</div>}
        
        {videoUrl && !isLoading && (
          <div className="space-y-6">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video src={videoUrl} controls className="w-full h-full"></video>
            </div>
             <button
                onClick={handleDownload}
                className="w-full flex justify-center items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                </svg>
                Download Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
