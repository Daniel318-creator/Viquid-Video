import React from 'react';
import { Button } from './Button';

interface ApiKeyModalProps {
  onSelectKey: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSelectKey }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border border-slate-700 rounded-2xl p-8 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-900/50 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3">Access Required</h2>
          <p className="text-slate-400 mb-6">
            To generate videos with AI Video Express (Veo), you need to connect your Google Cloud Project with a valid API key.
          </p>

          <div className="bg-slate-900/50 rounded-lg p-4 mb-6 text-left text-sm text-slate-400 border border-slate-700/50">
            <p className="mb-2">⚠️ <strong className="text-slate-200">Billing Required:</strong> Video generation requires a paid billing account linked to your project.</p>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              Read about billing &rarr;
            </a>
          </div>

          <Button onClick={onSelectKey} className="w-full">
            Select API Key
          </Button>
        </div>
      </div>
    </div>
  );
};