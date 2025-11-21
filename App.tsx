import React, { useState, useEffect } from 'react';
import { generateVideo } from './services/geminiService';
import { VideoConfig, GeneratedVideo, VideoGenerationState } from './types';
import { Button } from './components/Button';
import { ApiKeyModal } from './components/ApiKeyModal';
import { VideoPlayer } from './components/VideoPlayer';
import { LoadingDisplay } from './components/LoadingDisplay';

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [config, setConfig] = useState<VideoConfig>({
    aspectRatio: '16:9',
    resolution: '720p',
  });
  
  const [appState, setAppState] = useState<VideoGenerationState>({
    status: 'idle',
  });

  const [history, setHistory] = useState<GeneratedVideo[]>([]);

  const checkApiKey = async () => {
    try {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const hasSelected = await window.aistudio.hasSelectedApiKey();
        setHasKey(hasSelected);
      }
    } catch (e) {
      console.error("Error checking API key:", e);
    }
  };

  useEffect(() => {
    checkApiKey();
  }, []);

  const handleSelectKey = async () => {
    try {
      if (window.aistudio && window.aistudio.openSelectKey) {
        await window.aistudio.openSelectKey();
        // Assume success to avoid race condition as per guide
        setHasKey(true);
      } else {
        alert("AI Studio environment not detected. Please run this in the IDX environment.");
      }
    } catch (e) {
      console.error("Failed to select key:", e);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setAppState({ status: 'generating' });

    try {
      const videoUrl = await generateVideo(prompt, config);
      
      const newVideo: GeneratedVideo = {
        id: Date.now().toString(),
        url: videoUrl,
        prompt: prompt,
        createdAt: Date.now(),
        config: config
      };

      setAppState({
        status: 'completed',
        currentVideo: newVideo
      });

      setHistory(prev => [newVideo, ...prev]);

    } catch (error: any) {
      console.error("Generation error:", error);
      
      // Handle key issues specifically
      if (error.message && (error.message.includes("API Key invalid") || error.message.includes("Requested entity was not found"))) {
        setHasKey(false);
        setAppState({ status: 'idle', error: "API Key session expired or invalid. Please select a key again." });
      } else {
        setAppState({ status: 'error', error: error.message || "Something went wrong while generating the video." });
      }
    }
  };

  const handleReset = () => {
    setPrompt('');
    setAppState({ status: 'idle' });
  };

  return (
    <div className="min-h-screen bg-dark text-slate-100 selection:bg-indigo-500/30">
      
      {!hasKey && <ApiKeyModal onSelectKey={handleSelectKey} />}

      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-dark/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              AI Video Express
            </h1>
          </div>
          {hasKey && (
            <button 
                onClick={handleSelectKey}
                className="text-xs text-slate-400 hover:text-white transition-colors"
            >
                Change API Key
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-slate-700 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-indigo-400">1.</span> Describe your vision
              </h2>
              
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic city with flying cars in cyberpunk style, neon lights, 4k cinematic..."
                className="w-full h-40 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                disabled={appState.status === 'generating'}
              />

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-indigo-400">2.</span> Configuration
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Aspect Ratio</label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700">
                      <button
                        onClick={() => setConfig({ ...config, aspectRatio: '16:9' })}
                        className={`py-2 rounded-md text-sm font-medium transition-all ${config.aspectRatio === '16:9' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                      >
                        16:9
                      </button>
                      <button
                        onClick={() => setConfig({ ...config, aspectRatio: '9:16' })}
                        className={`py-2 rounded-md text-sm font-medium transition-all ${config.aspectRatio === '9:16' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                      >
                        9:16
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Resolution</label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700">
                       <button
                        onClick={() => setConfig({ ...config, resolution: '720p' })}
                        className={`py-2 rounded-md text-sm font-medium transition-all ${config.resolution === '720p' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                      >
                        720p
                      </button>
                      <button
                        onClick={() => setConfig({ ...config, resolution: '1080p' })}
                        className={`py-2 rounded-md text-sm font-medium transition-all ${config.resolution === '1080p' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                      >
                        1080p
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button 
                    onClick={handleGenerate} 
                    className="w-full" 
                    isLoading={appState.status === 'generating'}
                    disabled={!prompt.trim()}
                >
                  Generate Video
                </Button>
                {appState.error && (
                    <div className="mt-4 p-3 bg-red-900/30 border border-red-800/50 text-red-300 rounded-lg text-sm">
                        {appState.error}
                    </div>
                )}
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/50">
                <h3 className="text-sm font-semibold text-slate-300 mb-2">Pro Tips</h3>
                <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
                    <li>Be specific about lighting (e.g., "cinematic lighting", "golden hour").</li>
                    <li>Mention camera movement (e.g., "drone shot", "slow pan").</li>
                    <li>Define the style (e.g., "photorealistic", "cartoon", "3d render").</li>
                </ul>
            </div>
          </div>

          {/* Right Column: Preview/Result */}
          <div className="lg:col-span-7">
            
            {appState.status === 'idle' && history.length === 0 && (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/20 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                    <p className="text-lg">Your generated video will appear here</p>
                </div>
            )}

            {appState.status === 'generating' && (
                <LoadingDisplay />
            )}

            {appState.status === 'completed' && appState.currentVideo && (
                <div className="space-y-6">
                    <div className="bg-card p-2 rounded-2xl border border-indigo-500/30 shadow-2xl shadow-indigo-900/20 animate-in fade-in zoom-in duration-500">
                        <VideoPlayer src={appState.currentVideo.url} />
                    </div>
                    
                    <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <div>
                            <p className="text-sm text-slate-400">Prompt used</p>
                            <p className="text-white line-clamp-1">{appState.currentVideo.prompt}</p>
                        </div>
                        <div className="flex gap-2">
                            <a 
                                href={appState.currentVideo.url} 
                                download={`video-express-${Date.now()}.mp4`}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors text-white"
                            >
                                Download
                            </a>
                            <button 
                                onClick={handleReset}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors text-white"
                            >
                                New Video
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* History Grid (only show if we have history and not currently viewing just one) */}
            {history.length > 0 && (appState.status === 'idle' || appState.status === 'generating') && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Generations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {history.map((vid) => (
                            <div key={vid.id} className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:border-slate-600 transition-all group">
                                <div className="aspect-video bg-black relative">
                                    <video src={vid.url} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => setAppState({ status: 'completed', currentVideo: vid })}
                                            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full text-white"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <p className="text-xs text-slate-400 line-clamp-2">{vid.prompt}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;