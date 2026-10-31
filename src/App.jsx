import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { HeroBanner } from './components/HeroBanner.jsx';
import { PresetSelector } from './components/PresetSelector.jsx';
import { SourceInputSection } from './components/SourceInputSection.jsx';
import { AnalysisProgress } from './components/AnalysisProgress.jsx';
import { TrustDashboard } from './components/TrustDashboard.jsx';
import { DarkSpotsView } from './components/DarkSpotsView.jsx';
import { StructuredSummaryView } from './components/StructuredSummaryView.jsx';
import { VerifyChecklist } from './components/VerifyChecklist.jsx';
import { EvidenceModal } from './components/EvidenceModal.jsx';
import { HackathonSlidesModal } from './components/HackathonSlidesModal.jsx';
import { ExportReportModal } from './components/ExportReportModal.jsx';
import { SAMPLE_PRESETS } from './data/sampleDatasets.js';
import { analyzeInformationSources } from './utils/analysisEngine.js';

export function App() {
  const defaultPreset = SAMPLE_PRESETS[0]; // Slide 5 Scholarship Check
  
  const [selectedPresetId, setSelectedPresetId] = useState(defaultPreset.id);
  const [topic, setTopic] = useState(defaultPreset.topic);
  const [researchGoal, setResearchGoal] = useState(defaultPreset.researchGoal);
  const [sources, setSources] = useState(defaultPreset.sources);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [checklist, setChecklist] = useState([]);
  
  const [geminiKey, setGeminiKey] = useState('');
  const [backendOnline, setBackendOnline] = useState(false);
  
  const [activeEvidence, setActiveEvidence] = useState(null);
  const [showSlidesModal, setShowSlidesModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Check Backend Health on mount
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'online') {
          setBackendOnline(true);
        }
      })
      .catch(() => {
        setBackendOnline(false);
      });
  }, []);

  // Run initial analysis on first load so user immediately sees the Slide 5 case study
  useEffect(() => {
    handleRunAnalysis();
  }, []);

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setTopic(preset.topic);
    setResearchGoal(preset.researchGoal);
    setSources(preset.sources);
    
    // Automatically trigger analysis for seamless demo experience
    setTimeout(() => {
      runAnalysisWithData(preset.topic, preset.researchGoal, preset.sources);
    }, 50);
  };

  const handleNewCustom = () => {
    setSelectedPresetId('custom');
    setTopic('');
    setResearchGoal('');
    setSources([]);
    setAnalysisResult(null);
    setChecklist([]);
  };

  const handleLoadScholarshipDemo = () => {
    handleSelectPreset(defaultPreset);
  };

  const handleRunAnalysis = () => {
    runAnalysisWithData(topic, researchGoal, sources);
  };

  const runAnalysisWithData = async (activeTopic, activeGoal, activeSources) => {
    if (!activeSources || activeSources.length === 0) return;
    setIsAnalyzing(true);

    try {
      let result;
      // If backend is online, attempt backend analysis
      if (backendOnline) {
        try {
          const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              topic: activeTopic,
              researchGoal: activeGoal,
              sources: activeSources,
              geminiApiKey: geminiKey || undefined
            })
          });
          if (res.ok) {
            result = await res.json();
          }
        } catch (err) {
          console.warn('Backend call failed, using client engine fallback:', err);
        }
      }

      // Fallback or primary client-side semantic NLP engine
      if (!result) {
        result = analyzeInformationSources({
          topic: activeTopic,
          researchGoal: activeGoal,
          sources: activeSources
        });
      }

      setAnalysisResult(result);
      setChecklist(result.verifyChecklist || []);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleChecklist = (id) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Navigation */}
      <Navbar
        onOpenSlides={() => setShowSlidesModal(true)}
        onOpenExport={() => setShowExportModal(true)}
        geminiKey={geminiKey}
        setGeminiKey={setGeminiKey}
        backendOnline={backendOnline}
        onReset={handleLoadScholarshipDemo}
      />

      {/* Hero Problem Statement & Motto */}
      <HeroBanner onQuickDemo={handleLoadScholarshipDemo} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Preset Selector */}
        <PresetSelector
          selectedPresetId={selectedPresetId}
          onSelectPreset={handleSelectPreset}
          onNewCustom={handleNewCustom}
        />

        {/* Input Configuration & Sources Manager */}
        <SourceInputSection
          topic={topic}
          setTopic={setTopic}
          researchGoal={researchGoal}
          setResearchGoal={setResearchGoal}
          sources={sources}
          setSources={setSources}
          onRunAnalysis={handleRunAnalysis}
          isAnalyzing={isAnalyzing}
          backendOnline={backendOnline}
        />

        {/* Real-time scanning animation while analyzing */}
        {isAnalyzing && (
          <AnalysisProgress />
        )}

        {/* Analysis Results View */}
        {analysisResult && !isAnalyzing && (
          <div className="animate-fade-in space-y-8">
            
            {/* Slide 4 & 7: Trust Dashboard (Sourced vs AI vs Uncertain) */}
            <TrustDashboard
              dashboard={analysisResult.trustDashboard}
              meta={analysisResult.meta}
            />

            {/* Slide 3, 4, 5: Prioritized Verify Next Action Checklist */}
            <VerifyChecklist
              checklist={checklist}
              onToggleChecklist={handleToggleChecklist}
              onInspectEvidence={setActiveEvidence}
            />

            {/* Slide 4 & 5: Detected Dark Spots (Gaps, Conflicts, Outdated) */}
            <DarkSpotsView
              contradictions={analysisResult.contradictions}
              informationGaps={analysisResult.informationGaps}
              outdatedWarnings={analysisResult.outdatedWarnings}
              onInspectEvidence={setActiveEvidence}
            />

            {/* Slide 4: Structured Multi-Source Summary with Grounded Citations */}
            <StructuredSummaryView
              structuredFacts={analysisResult.structuredFacts}
              onInspectEvidence={setActiveEvidence}
            />

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <strong className="text-slate-300 font-bold">DIGITAL DARK SPOT</strong> • AI-Assisted Information Gap Detection Platform
          </div>
          <div className="text-slate-400">
            Presented by <strong className="text-amber-400">Upesh Chauhan</strong> (Roll No: 2404851520061) • Shinchan Online Hackathon 2026
          </div>
        </div>
      </footer>

      {/* Evidence Inspection Modal */}
      {activeEvidence && (
        <EvidenceModal
          evidence={activeEvidence}
          onClose={() => setActiveEvidence(null)}
        />
      )}

      {/* Slide Deck Reference Modal */}
      {showSlidesModal && (
        <HackathonSlidesModal
          onClose={() => setShowSlidesModal(false)}
          onLoadScholarshipDemo={handleLoadScholarshipDemo}
        />
      )}

      {/* Export Report Modal */}
      {showExportModal && analysisResult && (
        <ExportReportModal
          analysis={{
            ...analysisResult,
            verifyChecklist: checklist
          }}
          onClose={() => setShowExportModal(false)}
        />
      )}

    </div>
  );
}
