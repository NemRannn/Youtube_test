import { useState, useCallback } from 'react';
import type { StoryboardItem } from '../types';
import { 
  generateStoryboardPlan, 
  generateCharacterImage, 
  generateSceneImage,
  generateVideoFromImage,
  pollVideoOperation
} from '../services/geminiService';

export const useStoryboardGenerator = () => {
  const [storyboard, setStoryboard] = useState<StoryboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoGenerationMessage, setVideoGenerationMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);


  const generateStoryboard = useCallback(async (prompt: string, numImages: number, generateVideo: boolean) => {
    setIsLoading(true);
    setError(null);
    setStoryboard([]);
    setIsGeneratingVideo(false);
    setVideoUrl(null);
    setVideoError(null);

    let finalItems: StoryboardItem[] = [];

    try {
      // 1. Generate the storyboard plan
      setLoadingMessage('Breaking down your script into scenes...');
      const plan = await generateStoryboardPlan(prompt, numImages);

      let initialItems: StoryboardItem[] = plan.scenes.map((scene, index) => ({
        id: index + 1,
        imagePrompt: scene.image_prompt,
        voiceoverScript: scene.voiceover_script,
        imageBase64: null,
      }));
      setStoryboard(initialItems);

      // 2. Generate the character reference image
      setLoadingMessage('Creating a consistent character reference...');
      const characterImageBase64 = await generateCharacterImage(plan.character_sheet_prompt);
      
      // 3. Generate images for each scene in parallel
      setLoadingMessage(`Generating all ${numImages} images in parallel... This may take a moment.`);
      const imageGenerationPromises = initialItems.map(item => 
        generateSceneImage(characterImageBase64, item.imagePrompt)
      );
      
      const results = await Promise.allSettled(imageGenerationPromises);

      finalItems = initialItems.map((item, index) => {
        const result = results[index];
        if (result.status === 'fulfilled') {
          return { ...item, imageBase64: result.value };
        } else {
          console.error(`Failed to generate image for scene ${item.id}:`, result.reason);
          return item;
        }
      });
      
      setStoryboard(finalItems);
      setLoadingMessage('');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Image generation failed: ${errorMessage}`);
      console.error(err);
      setIsLoading(false);
      return; // Stop if image generation fails
    } finally {
      setIsLoading(false);
    }

    // 4. Generate video if requested
    if (generateVideo) {
        const firstValidImage = finalItems.find(item => item.imageBase64);
        if (firstValidImage && firstValidImage.imageBase64) {
            setIsGeneratingVideo(true);
            setVideoError(null);
            try {
                setVideoGenerationMessage('Initializing video generation... This can take several minutes.');
                let operation = await generateVideoFromImage(prompt, firstValidImage.imageBase64);
                
                setVideoGenerationMessage('Video is processing in the background. Please be patient.');

                while (!operation.done) {
                    await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
                    operation = await pollVideoOperation(operation);
                }

                const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
                if (downloadLink && process.env.API_KEY) {
                    setVideoGenerationMessage('Fetching final video file...');
                    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    setVideoUrl(url);
                } else {
                    throw new Error("Video generation completed, but no download link was provided.");
                }

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
                setVideoError(`Video generation failed: ${errorMessage}`);
                console.error(err);
            } finally {
                setIsGeneratingVideo(false);
                setVideoGenerationMessage('');
            }
        } else {
            setVideoError("Cannot generate video because no images were successfully created.");
        }
    }
  }, []);

  return { 
    storyboard, 
    isLoading, 
    loadingMessage, 
    error, 
    generateStoryboard,
    isGeneratingVideo,
    videoGenerationMessage,
    videoUrl,
    videoError
  };
};