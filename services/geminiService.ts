import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
import type { StoryPlan } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const sceneSchema = {
  type: Type.OBJECT,
  properties: {
    image_prompt: {
      type: Type.STRING,
      description: "A detailed, vivid, and cinematic prompt for an AI image generator to create this scene. This prompt should explicitly reference the main character's description to ensure consistency.",
    },
    voiceover_script: {
      type: Type.STRING,
      description: "A short, engaging voiceover script for this scene, 1-2 sentences long.",
    },
  },
  required: ["image_prompt", "voiceover_script"],
};

const storyPlanSchema = {
    type: Type.OBJECT,
    properties: {
        character_sheet_prompt: {
            type: Type.STRING,
            description: "A highly detailed visual description of the main character(s). Include appearance, clothing, style, and key features. This will be used to generate a consistent character reference image."
        },
        scenes: {
            type: Type.ARRAY,
            items: sceneSchema,
            description: "An array of scenes that make up the story."
        }
    },
    required: ["character_sheet_prompt", "scenes"]
};

export const generateStoryboardPlan = async (prompt: string, numImages: number): Promise<StoryPlan> => {
  const systemInstruction = `You are a creative storyboard director for YouTube videos. Your task is to break down a user's topic or script into a sequence of scenes. First, create a detailed character sheet description to ensure visual consistency. Then, for each scene, provide a detailed image prompt and a short voiceover script. The total number of scenes should be exactly ${numImages}.`;

  const userPrompt = `Generate a storyboard plan with exactly ${numImages} scenes based on the following input: "${prompt}"`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: storyPlanSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedPlan: StoryPlan = JSON.parse(jsonText);
    
    if (parsedPlan.scenes.length !== numImages) {
        console.warn(`Expected ${numImages} scenes, but got ${parsedPlan.scenes.length}. Adjusting...`);
        if (parsedPlan.scenes.length > numImages) {
            parsedPlan.scenes = parsedPlan.scenes.slice(0, numImages);
        }
    }

    return parsedPlan;
  } catch (error) {
    console.error("Error generating storyboard plan:", error);
    throw new Error("Failed to generate storyboard plan from Gemini.");
  }
};


export const generateCharacterImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `${prompt}, character sheet, multiple angles, neutral background, cinematic lighting, high detail`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '1:1',
            },
        });

        if (!response.generatedImages || response.generatedImages.length === 0) {
            throw new Error("Image generation returned no images.");
        }
        return response.generatedImages[0].image.imageBytes;
    } catch (error) {
        console.error("Error generating character image:", error);
        throw new Error("Failed to generate character reference image.");
    }
};

export const generateSceneImage = async (baseCharacterImage: string, prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: baseCharacterImage,
                            mimeType: 'image/png',
                        },
                    },
                    {
                        text: `Using the character from the provided image as a reference for consistency, create a new image for the following scene: "${prompt}". The new image should feature the same character but in the new setting and action described. The final image should be in a 16:9 aspect ratio, suitable for a video.`,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("NanoBanana model did not return an image.");

    } catch (error) {
        console.error("Error generating scene image with NanoBanana:", error);
        throw new Error("Failed to generate scene image.");
    }
};

export const generateVideoFromImage = async (prompt: string, base64Image: string) => {
    try {
        console.log("Starting video generation process...");
        const operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: `Create a cinematic video based on this story: "${prompt}". Use the provided image as a strong visual and character reference for the entire video.`,
            image: {
                imageBytes: base64Image,
                mimeType: 'image/png',
            },
            config: {
                numberOfVideos: 1,
            },
        });
        console.log("Video generation initiated, operation:", operation);
        return operation;
    } catch (error) {
        console.error("Error initiating video generation:", error);
        throw new Error("Failed to start video generation.");
    }
};

export const pollVideoOperation = async (operation: any) => {
    try {
        console.log("Polling video operation...");
        const result = await ai.operations.getVideosOperation({ operation });
        console.log("Polling result:", result);
        return result;
    } catch (error) {
        console.error("Error polling video operation:", error);
        throw new Error("Failed to poll video generation status.");
    }
};