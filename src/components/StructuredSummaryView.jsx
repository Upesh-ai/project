import React from 'react';
import { 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Tag, 
  Bookmark, 
  Eye
} from 'lucide-react';

export function StructuredSummaryView({ structuredFacts, onInspectEvidence }) {
  if (!structuredFacts || structuredFacts.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl mb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 bg-teal-400/10 px-2.5 py-0.5 rounded-full border border-teal-400/20">
              Slide 4 Deliverable
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Multi-Source Synthesis & Grounded Facts
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <span>Structured Multi-Source Summary</span>
          </h2>
        </div>

        <div className="text-xs text-slate-400">
          Every statement backed by explicit document citations
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {structuredFacts.map((fact) => (
          <div
            key={fact.id}
            className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-teal-400" />
                  <span>{fact.category}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {fact.citations.length} Citations
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {fact.citations.map((cite, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-200 leading-relaxed group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="flex-1">"{cite.statement}"</p>
                      <button
                        onClick={() => onInspectEvidence({
                          title: cite.sourceTitle,
                          url: cite.sourceUrl,
                          quote: cite.statement,
                          context: `Verified claim in category: ${fact.category}`
                        })}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-teal-300 transition-opacity shrink-0"
                        title="View Full Source Excerpt"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-2 flex items-center gap-2 pt-1.5 border-t border-slate-800/60 text-[11px] text-teal-400/90 font-mono">
                      <Tag className="w-3 h-3" />
                      <span className="truncate">{cite.sourceTitle}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
              {fact.summary}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
