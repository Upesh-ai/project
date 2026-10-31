import React from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  Plane, 
  Sparkles, 
  FileText,
  PlusCircle
} from 'lucide-react';
import { SAMPLE_PRESETS } from '../data/sampleDatasets.js';

export function PresetSelector({ selectedPresetId, onSelectPreset, onNewCustom }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'GraduationCap': return GraduationCap;
      case 'Briefcase': return Briefcase;
      case 'Plane': return Plane;
      default: return FileText;
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Select Benchmark Scenario or Case Study:</span>
        </label>
        
        <button
          onClick={onNewCustom}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Custom Research</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SAMPLE_PRESETS.map((preset) => {
          const Icon = getIcon(preset.icon);
          const isSelected = selectedPresetId === preset.id;

          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`text-left p-3.5 rounded-xl border transition-all relative ${
                isSelected
                  ? 'bg-blue-950/40 border-amber-400/80 shadow-md shadow-amber-950/30 ring-1 ring-amber-400/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {preset.tag && (
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ${
                  preset.id === 'scholarship-check'
                    ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                    : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                }`}>
                  {preset.tag}
                </span>
              )}

              <div className="flex items-start gap-2.5">
                <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                  isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white leading-snug">
                    {preset.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    "{preset.studentAsk}"
                  </p>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                <span>{preset.sources.length} Sources attached</span>
                <span className="text-blue-400 font-medium">{isSelected ? 'Active Scenario' : 'Click to Load'}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
