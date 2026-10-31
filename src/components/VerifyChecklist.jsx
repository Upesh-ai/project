import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  AlertCircle, 
  Eye, 
  ExternalLink, 
  Building2, 
  Sparkles,
  Filter
} from 'lucide-react';

export function VerifyChecklist({ checklist, onToggleChecklist, onInspectEvidence }) {
  const [filterPriority, setFilterPriority] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'

  if (!checklist || checklist.length === 0) return null;

  const completedCount = checklist.filter(c => c.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const filteredItems = checklist.filter(item => {
    if (filterPriority === 'ALL') return true;
    return item.priority === filterPriority;
  });

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'CRITICAL':
        return {
          badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          border: 'border-l-4 border-l-rose-500'
        };
      case 'HIGH':
        return {
          badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          border: 'border-l-4 border-l-amber-500'
        };
      default:
        return {
          badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
          border: 'border-l-4 border-l-blue-500'
        };
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl mb-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              Slide 3 & 4 Deliverable
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Actionable Next Steps Linked to Source Evidence
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <span>Verify Next: Action Checklist</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Slide 5 Checklist: Verify deadline, document requirements, renewal terms, and submission portal.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Verification Progress
            </div>
            <div className="text-sm font-bold text-white">
              {completedCount} of {checklist.length} Completed ({progressPercent}%)
            </div>
          </div>
          <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
            ></div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Priority Filter:</span>
        </span>

        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((pri) => (
          <button
            key={pri}
            onClick={() => setFilterPriority(pri)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              filterPriority === pri
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {pri}
          </button>
        ))}
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const style = getPriorityStyle(item.priority);

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl bg-slate-950/80 border border-slate-800 transition-all ${style.border} ${
                item.completed ? 'opacity-60 bg-slate-950/40' : 'hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3.5">
                
                {/* Interactive Checkbox */}
                <button
                  onClick={() => onToggleChecklist(item.id)}
                  className={`mt-0.5 p-1 rounded-lg transition-colors cursor-pointer ${
                    item.completed 
                      ? 'text-emerald-400 hover:text-emerald-300' 
                      : 'text-slate-500 hover:text-amber-400'
                  }`}
                  title={item.completed ? 'Mark as Unverified' : 'Mark as Verified'}
                >
                  {item.completed ? (
                    <CheckSquare className="w-5 h-5 fill-emerald-500/10" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                    <h3 className={`text-sm font-bold ${item.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                    {item.action}
                  </p>

                  {/* Target Authority and Evidence Link */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Building2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Target Contact: <strong className="text-slate-200">{item.targetEntity}</strong></span>
                    </div>

                    <button
                      onClick={() => onInspectEvidence({
                        title: item.sourceEvidence.sourceTitle,
                        url: item.sourceEvidence.sourceUrl,
                        quote: item.sourceEvidence.excerpt,
                        context: `Verification trigger for: "${item.title}"`
                      })}
                      className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Every finding links back to its source evidence</span>
                    </button>
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
