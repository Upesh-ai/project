import React, { useState } from 'react';
import { 
  HelpCircle, 
  Scale, 
  Clock, 
  AlertTriangle, 
  ExternalLink, 
  ShieldAlert, 
  CheckCircle,
  Eye,
  Info
} from 'lucide-react';

export function DarkSpotsView({ 
  contradictions, 
  informationGaps, 
  outdatedWarnings, 
  onInspectEvidence 
}) {
  const [activeTab, setActiveTab] = useState('gaps'); // 'gaps' | 'contradictions' | 'outdated'

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl mb-8">
      
      {/* View Header with Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              Slide 4 Core Findings
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Information Discrepancies & Missing Knowledge
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <span>Detected Dark Spots</span>
          </h2>
        </div>

        {/* 3 Tab Switchers */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          
          <button
            onClick={() => setActiveTab('gaps')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'gaps'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Information Gaps ({informationGaps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contradictions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'contradictions'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Contradictions ({contradictions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('outdated')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'outdated'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Outdated Warnings ({outdatedWarnings.length})</span>
          </button>

        </div>
      </div>

      {/* TAB 1: Information Gaps (Slide 4: "Information gaps - Unanswered questions listed") */}
      {activeTab === 'gaps' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Essential domain rules omitted or left unanswered across all evaluated documents:</span>
            <span className="text-amber-400 font-semibold text-[11px]">Slide 5: "GAP: Renewal requirements not found"</span>
          </div>

          {informationGaps.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">No missing information gaps detected.</p>
          ) : (
            informationGaps.map((gap) => (
              <div
                key={gap.id}
                className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition-all shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
                      <HelpCircle className="w-4 h-4" />
                    </span>
                    <h3 className="font-bold text-base text-white">{gap.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getSeverityBadge(gap.severity)}`}>
                      {gap.severity} GAP
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {gap.category}
                    </span>
                  </div>
                </div>

                {/* Primary Unanswered Question */}
                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 text-amber-200 text-sm font-semibold mb-3">
                  <span className="text-amber-400 font-bold mr-1.5">Unanswered Question:</span>
                  "{gap.question}"
                </div>

                {/* Why It Matters & Recommended Action */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="font-bold text-rose-400 uppercase tracking-wider text-[10px] block mb-1">
                      Risk If Left Unverified
                    </span>
                    <p className="text-slate-300 leading-relaxed">{gap.whyItMatters}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="font-bold text-teal-400 uppercase tracking-wider text-[10px] block mb-1">
                      Recommended Action
                    </span>
                    <p className="text-slate-300 leading-relaxed">{gap.recommendedAction}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Contradictions (Slide 4: "Contradictions - Conflicting claims with references") */}
      {activeTab === 'contradictions' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Direct clashes where two or more authoritative sources give contradictory details:</span>
            <span className="text-rose-400 font-semibold text-[11px]">Slide 5: "CONFLICT: Two sources list different income documents"</span>
          </div>

          {contradictions.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">No conflicting statements detected between sources.</p>
          ) : (
            contradictions.map((conflict) => (
              <div
                key={conflict.id}
                className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-rose-500/40 transition-all shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400">
                      <Scale className="w-4 h-4" />
                    </span>
                    <h3 className="font-bold text-base text-white">{conflict.title}</h3>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-auto ${getSeverityBadge(conflict.severity)}`}>
                    {conflict.severity} CONFLICT
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  {conflict.description}
                </p>

                {/* Side-by-Side Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  
                  {/* Source A */}
                  <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-900/40">
                    <div className="flex items-center justify-between text-xs mb-2 pb-1.5 border-b border-blue-900/30">
                      <span className="font-bold text-blue-300 truncate max-w-[200px]" title={conflict.sourceA.title}>
                        Source A: {conflict.sourceA.title}
                      </span>
                      <button
                        onClick={() => onInspectEvidence({
                          title: conflict.sourceA.title,
                          url: conflict.sourceA.url,
                          quote: conflict.sourceA.quote || conflict.sourceA.claim,
                          context: 'Conflicting claim in Source A'
                        })}
                        className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </div>
                    <div className="text-xs font-semibold text-white mb-2">
                      "{conflict.sourceA.claim}"
                    </div>
                    <div className="text-[11px] text-slate-400 bg-slate-950/70 p-2 rounded border border-slate-800/80 font-mono italic">
                      "{conflict.sourceA.quote}"
                    </div>
                  </div>

                  {/* Source B */}
                  <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40">
                    <div className="flex items-center justify-between text-xs mb-2 pb-1.5 border-b border-rose-900/30">
                      <span className="font-bold text-rose-300 truncate max-w-[200px]" title={conflict.sourceB.title}>
                        Source B: {conflict.sourceB.title}
                      </span>
                      <button
                        onClick={() => onInspectEvidence({
                          title: conflict.sourceB.title,
                          url: conflict.sourceB.url,
                          quote: conflict.sourceB.quote || conflict.sourceB.claim,
                          context: 'Conflicting claim in Source B'
                        })}
                        className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </div>
                    <div className="text-xs font-semibold text-white mb-2">
                      "{conflict.sourceB.claim}"
                    </div>
                    <div className="text-[11px] text-slate-400 bg-slate-950/70 p-2 rounded border border-slate-800/80 font-mono italic">
                      "{conflict.sourceB.quote}"
                    </div>
                  </div>

                </div>

                {/* Practical Impact */}
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200">Real-World Consequence: </strong>
                    {conflict.impact}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: Outdated Warnings (Slide 4: "Outdated warnings - Old or undated sources flagged") */}
      {activeTab === 'outdated' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Documents referring to earlier academic or application cycles that risk misleading the user:</span>
            <span className="text-amber-400 font-semibold text-[11px]">Slide 5: "OUTDATED: One page refers to an earlier application cycle"</span>
          </div>

          {outdatedWarnings.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">All evaluated documents appear current and aligned with the active cycle.</p>
          ) : (
            outdatedWarnings.map((warn) => (
              <div
                key={warn.id}
                className="p-5 rounded-xl bg-slate-950/70 border border-amber-900/40 hover:border-amber-500/50 transition-all shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
                      <Clock className="w-4 h-4" />
                    </span>
                    <h3 className="font-bold text-base text-white">{warn.sourceTitle}</h3>
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-amber-500/15 text-amber-300 border-amber-500/30">
                    EXPIRED CYCLE DETECTED
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3">
                  <span className="text-amber-300 font-bold">{warn.outdatedSignal}</span>
                  <span>•</span>
                  <span>Published / Cycle Date: <strong className="text-slate-200">{warn.publishedDate}</strong></span>
                  <span>•</span>
                  <a
                    href={warn.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
                  >
                    <span>{warn.sourceUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Excerpt */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 mb-3 italic">
                  "{warn.quote}"
                </div>

                {/* Risk and Fix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="font-bold text-rose-400 uppercase tracking-wider text-[10px] block mb-1">
                      Misinformation Danger
                    </span>
                    <p className="text-slate-300 leading-relaxed">{warn.risk}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                    <span className="font-bold text-teal-400 uppercase tracking-wider text-[10px] block mb-1">
                      Correction Guidance
                    </span>
                    <p className="text-slate-300 leading-relaxed">{warn.suggestedFix}</p>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
