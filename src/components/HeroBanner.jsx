import React from 'react';
import { 
  Network, 
  Clock, 
  Scale, 
  HelpCircle, 
  Sparkles, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export function HeroBanner({ onQuickDemo }) {
  const problems = [
    {
      title: 'Scattered',
      desc: 'Details spread across many sites, PDFs, portals, and buried appendices.',
      icon: Network,
      color: 'from-blue-500/20 to-blue-600/5',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400'
    },
    {
      title: 'Outdated',
      desc: 'Pages may quietly refer to earlier application cycles or expired dates.',
      icon: Clock,
      color: 'from-amber-500/20 to-amber-600/5',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400'
    },
    {
      title: 'Conflicting',
      desc: 'Different authoritative sources give irreconcilable instructions and rules.',
      icon: Scale,
      color: 'from-rose-500/20 to-rose-600/5',
      borderColor: 'border-rose-500/30',
      iconColor: 'text-rose-400'
    },
    {
      title: 'Unanswered',
      desc: 'Vital questions (like renewal policies and appeals) are never covered at all.',
      icon: HelpCircle,
      color: 'from-teal-500/20 to-teal-600/5',
      borderColor: 'border-teal-500/30',
      iconColor: 'text-teal-400'
    }
  ];

  return (
    <div className="relative overflow-hidden pt-8 pb-10 border-b border-slate-800/60 bg-gradient-to-b from-[#0e1628] to-[#090d16]">
      {/* Decorative gradient glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Pitch */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide uppercase mb-4 animate-pulse-subtle">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI-Assisted Information Gap Detection</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Not just finding information, but <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
              knowing what to verify next.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            Traditional AI chatbots hallucinate or gloss over missing details. 
            <strong> Digital Dark Spot</strong> cross-references multiple source documents to pinpoint contradictions, 
            flag expired guidelines, expose unanswered blind spots, and give you a prioritized verification checklist.
          </p>

          {/* Quick Demo CTA */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onQuickDemo}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-950/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Load Slide 5 Scholarship Example</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Pillars: Why Information Has Dark Spots (Slide 2) */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>Why Information Has Dark Spots</span>
              <span className="text-slate-600">•</span>
              <span className="text-blue-400 font-normal">Slide 2 Root Causes</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {problems.map((prob) => {
              const Icon = prob.icon;
              return (
                <div
                  key={prob.title}
                  className={`relative p-4 rounded-xl bg-gradient-to-b ${prob.color} bg-slate-900/60 border ${prob.borderColor} transition-all hover:bg-slate-900/90 shadow-sm`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-slate-950/70 ${prob.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-white text-base">{prob.title}</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {prob.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
