import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  HelpCircle, 
  PieChart, 
  Layers, 
  FileCheck2,
  Calendar,
  Scale
} from 'lucide-react';

export function TrustDashboard({ dashboard, meta }) {
  if (!dashboard) return null;

  const { reliabilityScore, statusText, breakdown, metrics } = dashboard;
  const { sourced, aiInferred, uncertain } = breakdown;

  // Determine color styling based on score
  const getScoreBadge = (score) => {
    if (score >= 75) return 'from-emerald-500 to-teal-600 text-emerald-950';
    if (score >= 50) return 'from-amber-400 to-amber-600 text-amber-950';
    return 'from-rose-500 to-rose-700 text-rose-950';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl mb-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              Slide 4 & 7 Deliverable
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Verified Evidence vs. AI Inferences vs. Dark Spots
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <span>Trust & Verification Dashboard</span>
          </h2>
        </div>

        {/* Reliability Score Badge */}
        <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 self-start md:self-auto">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getScoreBadge(reliabilityScore)} flex flex-col items-center justify-center font-extrabold shadow-md shrink-0`}>
            <span className="text-base leading-none">{reliabilityScore}</span>
            <span className="text-[9px] uppercase tracking-tighter opacity-80">%</span>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Overall Reliability Index
            </div>
            <div className="text-xs font-bold text-slate-200">
              {statusText}
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Segment Horizontal Trust Bar (Slide 7: Sourced vs AI vs Uncertain) */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-bold mb-2 text-slate-300">
          <span>Information Composition Ratio</span>
          <span className="text-slate-400 font-normal text-[11px]">Slide 7: "Know What's Missing"</span>
        </div>

        <div className="w-full h-5 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800 flex shadow-inner">
          {/* Sourced */}
          <div
            style={{ width: `${sourced.percentage}%` }}
            className="h-full bg-teal-500 hover:bg-teal-400 transition-all rounded-l-full relative group cursor-pointer"
            title={`Sourced Evidence: ${sourced.percentage}%`}
          >
            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-950 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-500/40 pointer-events-none whitespace-nowrap z-20">
              Sourced {sourced.percentage}%
            </div>
          </div>

          {/* AI Inferred */}
          <div
            style={{ width: `${aiInferred.percentage}%` }}
            className="h-full bg-blue-500 hover:bg-blue-400 transition-all relative group cursor-pointer"
            title={`AI-Suggested Inferences: ${aiInferred.percentage}%`}
          >
            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-950 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/40 pointer-events-none whitespace-nowrap z-20">
              AI-Inferred {aiInferred.percentage}%
            </div>
          </div>

          {/* Uncertain & Gaps */}
          <div
            style={{ width: `${uncertain.percentage}%` }}
            className="h-full bg-amber-500 hover:bg-amber-400 transition-all rounded-r-full relative group cursor-pointer"
            title={`Uncertain & Gaps: ${uncertain.percentage}%`}
          >
            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-950 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/40 pointer-events-none whitespace-nowrap z-20">
              Uncertain / Gaps {uncertain.percentage}%
            </div>
          </div>
        </div>

        {/* Legend Cards (Slide 7 Definitions) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-3.5">
          
          {/* Sourced */}
          <div className="p-3 rounded-xl bg-teal-950/20 border border-teal-800/40 flex items-start gap-2.5">
            <div className="w-3 h-3 rounded-full bg-teal-400 mt-1 shrink-0"></div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-teal-300">Sourced Evidence</span>
                <span className="text-xs font-mono font-bold text-teal-400">{sourced.percentage}%</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                Facts backed directly by a linked source reference and verifiable document passages.
              </p>
            </div>
          </div>

          {/* AI Inferred */}
          <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-800/40 flex items-start gap-2.5">
            <div className="w-3 h-3 rounded-full bg-blue-400 mt-1 shrink-0"></div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-blue-300">AI-Suggested Inferences</span>
                <span className="text-xs font-mono font-bold text-blue-400">{aiInferred.percentage}%</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                Thematic grouping, synthesis, and deduplication clearly labelled as AI-generated.
              </p>
            </div>
          </div>

          {/* Uncertain */}
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 flex items-start gap-2.5">
            <div className="w-3 h-3 rounded-full bg-amber-400 mt-1 shrink-0"></div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-amber-300">Uncertain & Dark Spots</span>
                <span className="text-xs font-mono font-bold text-amber-400">{uncertain.percentage}%</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                Gaps, conflicts, unstated policies, and outdated dates requiring official manual verification.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Metrics Quick Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-4 border-t border-slate-800/80">
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <div className="text-xs text-slate-400 mb-0.5">Sources Reviewed</div>
          <div className="text-lg font-mono font-bold text-white">{metrics.totalSources}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <div className="text-xs text-amber-400 mb-0.5">Information Gaps</div>
          <div className="text-lg font-mono font-bold text-amber-300">{metrics.gapsIdentified}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <div className="text-xs text-rose-400 mb-0.5">Contradictions</div>
          <div className="text-lg font-mono font-bold text-rose-300">{metrics.contradictionsFound}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
          <div className="text-xs text-amber-300 mb-0.5">Outdated Cycles</div>
          <div className="text-lg font-mono font-bold text-amber-300">{metrics.outdatedItems}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/50 text-center col-span-2 sm:col-span-1">
          <div className="text-xs text-blue-300 mb-0.5">Action Checklist</div>
          <div className="text-lg font-mono font-bold text-blue-400">{metrics.verifyActionsRequired} Items</div>
        </div>
      </div>

    </div>
  );
}
