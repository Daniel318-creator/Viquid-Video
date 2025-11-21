import { GoogleGenAI } from "@google/genai";
import { VideoConfig } from "../types";

const VEO_MODEL_FAST = 'veo-3.1-fast-generate-preview';
// const VEO_MODEL_HIGH_QUALITY = 'veo-3.1-generate-preview';

/**
 * Generates a video using the Gemini Veo model.
 * 
 * @param prompt The text description of the video.
 * @param config Configuration for aspect ratio and resolution.
 * @returns A promise that resolves to the Blob URL of the generated video.
 */
export const generateVideo = async (
  prompt: string,
  config: VideoConfig
): Promise<string> => {
  // Always create a new instance to ensure we use the latest API key from the environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    console.log("Starting video generation...");
    let operation = await ai.models.generateVideos({
      model: VEO_MODEL_FAST,
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: config.resolution,
        aspectRatio: config.aspectRatio,
      },
    });

    console.log("Operation started, polling for completion...");
    
    // Polling loop
    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5 seconds
      operation = await ai.operations.getVideosOperation({ operation: operation });
      console.log("Polling status:", operation.metadata);
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!videoUri) {
      throw new Error("Video generation completed but no URI was returned.");
    }

    console.log("Video generated, fetching content...");
    
    // The URI requires the API key to be appended for access
    const fetchUrl = `${videoUri}&key=${process.env.API_KEY}`;
    
    const response = await fetch(fetchUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch video content: ${response.statusText}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);

  } catch (error: any) {
    console.error("Video generation failed:", error);
    // Handle specific error messages if needed
    if (error.message?.includes("Requested entity was not found")) {
        throw new Error("API Key invalid or expired. Please re-select your key.");
    }
    throw error;
  }
};