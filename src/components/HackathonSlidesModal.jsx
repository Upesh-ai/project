import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Presentation, 
  CheckCircle2, 
  Code, 
  Sparkles,
  Layers
} from 'lucide-react';

export function HackathonSlidesModal({ onClose, onLoadScholarshipDemo }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      slideNum: 1,
      title: 'DIGITAL DARK SPOT',
      subtitle: 'AI-Assisted Information Gap Detection Platform',
      hackathon: 'SHINCHAN ONLINE HACKATHON 2026',
      presenter: 'UPESH CHAUHAN (Roll No.: 2404851520061)',
      implementedAs: 'Full platform design, branding, and color palette (Deep Navy #1e3a8a, Amber #f59e0b, and Teal #0d9488) with magnifying glass question mark insignia.',
      keyPoints: [
        'Hackathon: Shinchan Online Hackathon 2026',
        'Presenter: Upesh Chauhan (Roll No.: 2404851520061)',
        'Motto: "Not just finding information, but knowing what to verify next."'
      ]
    },
    {
      slideNum: 2,
      title: 'Why Information Has Dark Spots',
      subtitle: 'The 4 Core Challenges in Multi-Source Research',
      implementedAs: 'Hero Banner problem cards and anomaly classification engine.',
      keyPoints: [
        'Scattered: Details spread across many sites, PDFs, and documents.',
        'Outdated: Pages may quietly refer to earlier cycles or expired dates.',
        'Conflicting: Different sources give contradictory requirements.',
        'Unanswered: Key questions (like renewal policies) are never covered at all.'
      ]
    },
    {
      slideNum: 3,
      title: 'How It Works',
      subtitle: '5-Stage Analysis Pipeline',
      implementedAs: 'Interactive workflow and real-time scanning progress component with multi-stage verification linking every finding back to source evidence.',
      keyPoints: [
        '1. Enter topic: Question or research goal',
        '2. Add sources: URLs or permitted search',
        '3. AI analysis: Extract facts, claims, dates',
        '4. Detect issues: Gaps, conflicts, outdated info',
        '5. Verify next: Prioritized checklist with sources (Every finding links back to its source evidence)'
      ]
    },
    {
      slideNum: 4,
      title: 'What It Delivers',
      subtitle: '6 Primary Deliverables & Dashboard Panels',
      implementedAs: 'Structured Summary, Information Gaps Tab, Contradictions Comparison, Outdated Warnings, Verify Action Checklist, and Trust Dashboard.',
      keyPoints: [
        'Structured summary: Key facts across all sources',
        'Information gaps: Unanswered questions listed',
        'Contradictions: Conflicting claims with references',
        'Outdated warnings: Old or undated sources flagged',
        'Verify checklist: Prioritized next steps',
        'Trust dashboard: Sourced vs AI vs uncertain'
      ]
    },
    {
      slideNum: 5,
      title: 'Example: Scholarship Check',
      subtitle: 'The Exact Case Study from the Hackathon Deck',
      implementedAs: 'Pre-loaded benchmark scenario executable with 1-click in the app with exact Gap, Conflict, Outdated warning, and Checklist items.',
      keyPoints: [
        'STUDENT ASKS: "What should I verify before applying for this scholarship?"',
        'GAP: Renewal requirements not found in the sources reviewed',
        'CONFLICT: Two sources list different income documents ($60k IRS 1040 vs $65k Bank Statements / W-2)',
        'OUTDATED: One page refers to an earlier application cycle (2023-2024)',
        'VERIFY: Deadline, document list, renewal policy, apply link'
      ]
    },
    {
      slideNum: 6,
      title: 'Proposed Tech Stack',
      subtitle: 'Architecture & Engineering Components',
      implementedAs: 'Fully instantiated and running in this repository:',
      keyPoints: [
        'Web Interface: React + Tailwind dashboard with evidence cards',
        'Backend API: Node.js Express / FastAPI orchestrator with CORS & scraping',
        'AI Engine: LLM / semantic engine extracts claims, dates, and compares sources',
        'Source Collection: User URLs, permitted search, page parsing via Cheerio'
      ]
    },
    {
      slideNum: 7,
      title: "Know What's Missing",
      subtitle: 'Final Takeaway & Core Philosophical Value',
      implementedAs: 'Trust Dashboard meter breaking down Sourced vs AI-suggested vs Uncertain.',
      keyPoints: [
        'Sourced: Facts backed by a linked source reference',
        'AI-suggested: Inferences clearly labelled as AI-generated',
        'Uncertain: Gaps, conflicts and undated claims to verify',
        'Motto: "Not just finding information, but knowing what to verify next."'
      ]
    }
  ];

  const current = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl shadow-black relative flex flex-col max-h-[90vh]">
        
        {/* Top Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Presentation className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">
              Hackathon Pitch Deck Inspector
            </h3>
            <span className="text-xs text-slate-400 font-mono ml-2">
              Slide {current.slideNum} of {slides.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Content Box */}
        <div className="my-6 p-6 rounded-2xl bg-gradient-to-br from-[#0e1628] to-[#090d16] border border-blue-900/40 relative overflow-hidden shadow-inner flex-1 overflow-y-auto">
          
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-2">
            <span>Slide {current.slideNum} Reference</span>
            <span>Shinchan Online Hackathon 2026</span>
          </div>

          <h2 className="text-2xl font-extrabold text-white mb-1">
            {current.title}
          </h2>

          <p className="text-sm font-semibold text-blue-300 mb-4">
            {current.subtitle}
          </p>

          {/* Key Bullet Points */}
          <div className="space-y-2 mb-6">
            {current.keyPoints.map((pt, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{pt}</span>
              </div>
            ))}
          </div>

          {/* Implementation in Project */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 text-teal-400 font-bold uppercase text-[10px] mb-1">
              <Code className="w-3.5 h-3.5" />
              <span>How This Project Implements It:</span>
            </div>
            <p className="leading-relaxed">{current.implementedAs}</p>
          </div>

          {current.slideNum === 5 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  onLoadScholarshipDemo();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-md"
              >
                Run Slide 5 Case Study in App Now
              </button>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentSlide ? 'bg-amber-400 w-6' : 'bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
              disabled={currentSlide === slides.length - 1}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
