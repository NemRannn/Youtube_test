
import React, { useState } from 'react';
import type { StoryboardItem } from '../types';

declare const JSZip: any;

interface DownloadButtonProps {
  storyboard: StoryboardItem[];
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ storyboard }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (typeof JSZip === 'undefined') {
      alert('JSZip library is not loaded. Cannot download files.');
      return;
    }
    
    setIsDownloading(true);

    try {
      const zip = new JSZip();
      
      storyboard.forEach((item, index) => {
        // Add script
        zip.file(`scene_${index + 1}_script.txt`, item.voiceoverScript);
        
        // Add image
        if (item.imageBase64) {
          const base64Data = item.imageBase64;
          zip.file(`scene_${index + 1}_image.png`, base64Data, { base64: true });
        }
      });
      
      const content = await zip.generateAsync({ type: 'blob' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'ai_storyboard.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

    } catch (error) {
      console.error('Error creating zip file:', error);
      alert('Failed to create the download file. Please check the console for errors.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-wait transform hover:scale-105"
    >
      <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
        <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
      </svg>
      {isDownloading ? 'Packaging...' : 'Download All'}
    </button>
  );
};
