export interface VideoConfig {
  aspectRatio: '16:9' | '9:16';
  resolution: '720p' | '1080p';
}

export interface GeneratedVideo {
  id: string;
  url: string;
  prompt: string;
  createdAt: number;
  config: VideoConfig;
}

export interface VideoGenerationState {
  status: 'idle' | 'generating' | 'completed' | 'error';
  progressMessage?: string;
  error?: string;
  currentVideo?: GeneratedVideo;
}

// Augment window for AI Studio helpers
declare global {
  interface AIStudio {
    hasSelectedApiKey(): Promise<boolean>;
    openSelectKey(): Promise<void>;
  }
}