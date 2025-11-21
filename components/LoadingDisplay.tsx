import React, { useEffect, useState } from 'react';

const TIPS = [
  "Dreaming up your scene...",
  "Rendering pixels...",
  "Applying cinematic lighting...",
  "Polishing the frames...",
  "Almost there..."
];

export const LoadingDisplay: React.FC = () => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm min-h-[300px]">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-indigo-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-t-4 border-l-4 border-purple-500 animate-spin-reverse opacity-70"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-indigo-300 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">Generating Video</h3>
      <p className="text-slate-400 animate-pulse transition-all duration-500">
        {TIPS[tipIndex]}
      </p>
      
      <div className="mt-8 w-full max-w-xs bg-slate-700 rounded-full h-1.5 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 w-[200%] animate-gradient-x"></div>
      </div>
      <p className="text-xs text-slate-500 mt-4">This usually takes about 30-60 seconds.</p>
    </div>
  );
};