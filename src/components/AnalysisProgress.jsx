import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Link as LinkIcon, 
  Bot, 
  AlertTriangle, 
  CheckSquare, 
  CheckCircle2,
  Loader2 
} from 'lucide-react';

export function AnalysisProgress({ onComplete }) {
  const steps = [
    { label: 'Enter Topic', desc: 'Analyzing research goal & focus questions', icon: Search },
    { label: 'Add Sources', desc: 'Tokenizing & cross-referencing documents', icon: LinkIcon },
    { label: 'AI Analysis', desc: 'Extracting facts, claims, monetary rules & dates', icon: Bot },
    { label: 'Detect Issues', desc: 'Identifying gaps, contradictions & outdated cycles', icon: AlertTriangle },
    { label: 'Verify Next', desc: 'Synthesizing evidence-linked checklist', icon: CheckSquare },
  ];

  const [currentStep, setCurrentStep] = useState(2); // Start at stage 3

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(3), 600);
    const timer2 = setTimeout(() => setCurrentStep(4), 1300);
    const timer3 = setTimeout(() => {
      setCurrentStep(5);
      if (onComplete) onComplete();
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl mb-8 animate-fade-in">
      <div className="text-center max-w-md mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
          <span>Slide 3 Analysis Pipeline</span>
        </div>
        <h3 className="text-lg font-bold text-white">Scanning for Digital Dark Spots</h3>
        <p className="text-xs text-slate-400 mt-1">Cross-analyzing multi-source evidence matrices in real time</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {steps.map((s, index) => {
          const Icon = s.icon;
          const isDone = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div
              key={s.label}
              className={`p-3.5 rounded-xl border text-center transition-all ${
                isDone
                  ? 'bg-blue-950/30 border-blue-500/40 text-blue-300'
                  : isCurrent
                  ? 'bg-amber-500/10 border-amber-400 text-amber-300 shadow-md shadow-amber-950/20 ring-1 ring-amber-400'
                  : 'bg-slate-950 border-slate-800/80 text-slate-500'
              }`}
            >
              <div className="flex justify-center mb-2">
                <div className={`p-2 rounded-lg ${
                  isDone 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : isCurrent 
                    ? 'bg-amber-400 text-slate-950' 
                    : 'bg-slate-900 text-slate-600'
                }`}>
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
              </div>
              <h4 className="font-bold text-xs text-white mb-0.5">{s.label}</h4>
              <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
