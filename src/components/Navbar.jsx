import React, { useState } from 'react';
import { 
  Search, 
  HelpCircle, 
  Presentation, 
  Key, 
  FileDown, 
  ShieldAlert, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export function Navbar({ 
  onOpenSlides, 
  onOpenExport, 
  geminiKey, 
  setGeminiKey, 
  backendOnline, 
  onReset 
}) {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(geminiKey || '');

  const handleSaveKey = () => {
    setGeminiKey(tempKey.trim());
    setShowKeyModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
          
          {/* Logo & Hackathon Identity */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={onReset}>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-900 to-slate-900 border border-blue-500/40 flex items-center justify-center shadow-lg shadow-blue-950/50">
              <span className="text-amber-400 font-extrabold text-xl">?</span>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[9px] font-bold text-slate-950">
                AI
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                  DIGITAL <span className="text-amber-400">DARK SPOT</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Hackathon 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                AI-Assisted Information Gap Detection Platform
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Backend Status indicator */}
            <div 
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                backendOnline 
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50' 
                  : 'bg-amber-950/40 text-amber-300 border-amber-800/50'
              }`}
              title={backendOnline ? 'Node.js Express Backend is active' : 'Running with built-in client AI engine'}
            >
              <div className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></div>
              <span>{backendOnline ? 'API Connected' : 'Local Semantic Engine'}</span>
            </div>

            {/* View Presentation Slides */}
            <button
              onClick={onOpenSlides}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors shadow-sm"
            >
              <Presentation className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Pitch Slides</span>
            </button>

            {/* API Config Modal Trigger */}
            <button
              onClick={() => setShowKeyModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors shadow-sm"
              title="Configure Gemini API Key"
            >
              <Key className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">{geminiKey ? 'Gemini Active' : 'API Key'}</span>
            </button>

            {/* Export Report Trigger */}
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-md shadow-blue-900/30"
            >
              <FileDown className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Sub-bar showing Hackathon participant credentials */}
        <div className="bg-slate-900/80 border-t border-slate-800/40 px-4 py-1 text-center text-[11px] text-slate-400 flex items-center justify-center gap-3">
          <span className="font-semibold text-slate-300">SHINCHAN ONLINE HACKATHON 2026</span>
          <span className="text-slate-600">•</span>
          <span>Presented by: <strong className="text-amber-300">UPESH CHAUHAN</strong></span>
          <span className="text-slate-600">•</span>
          <span>Roll No: <strong className="text-slate-300">2404851520061</strong></span>
        </div>
      </header>

      {/* Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-black/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">LLM Configuration</h3>
              </div>
              <button 
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              Digital Dark Spot works <strong>100% out-of-the-box</strong> using our built-in high-precision semantic NLP engine.
              Optionally, you can enter a <strong>Google Gemini API key</strong> for enhanced deep LLM reasoning.
            </p>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Gemini API Key (Optional)
              </label>
              <input
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
              <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                <span>Stored locally in browser session memory.</span>
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => {
                  setTempKey('');
                  setGeminiKey('');
                  setShowKeyModal(false);
                }}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
              >
                Clear Key
              </button>
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-md"
              >
                Save & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
