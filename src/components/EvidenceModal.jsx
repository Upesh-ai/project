import React from 'react';
import { 
  FileText, 
  ExternalLink, 
  CheckCircle, 
  X, 
  Quote, 
  ShieldCheck,
  Calendar
} from 'lucide-react';

export function EvidenceModal({ evidence, onClose }) {
  if (!evidence) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-6 shadow-2xl shadow-black relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Source Attribution & Verification Evidence
            </span>
            <h3 className="text-lg font-bold text-white">
              {evidence.title || 'Document Excerpt'}
            </h3>
          </div>
        </div>

        {/* Context Note */}
        {evidence.context && (
          <div className="mb-4 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <strong className="text-amber-400">Flagged Context:</strong> {evidence.context}
          </div>
        )}

        {/* Full Quotation */}
        <div className="mb-5 p-4 rounded-xl bg-slate-950/90 border border-slate-800 relative">
          <div className="text-xs text-slate-400 uppercase font-mono mb-1">Original Text Excerpt:</div>
          <p className="text-sm text-slate-200 leading-relaxed font-mono italic">
            "{evidence.quote}"
          </p>
        </div>

        {/* Source Metadata & Deep-Link */}
        <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-900/30 flex items-center justify-between gap-3 text-xs mb-5">
          <div className="flex items-center gap-2 text-slate-300 truncate">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
            <span className="truncate">Source Reference: {evidence.url || 'Internal Repository'}</span>
          </div>

          {evidence.url && evidence.url.startsWith('http') && (
            <a
              href={evidence.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold text-blue-400 hover:text-blue-300 shrink-0"
            >
              <span>Visit Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
