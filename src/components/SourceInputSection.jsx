import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Globe, 
  FileText, 
  Archive, 
  Link as LinkIcon, 
  Play, 
  Calendar, 
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';

export function SourceInputSection({
  topic,
  setTopic,
  researchGoal,
  setResearchGoal,
  sources,
  setSources,
  onRunAnalysis,
  isAnalyzing,
  backendOnline
}) {
  const [activeTab, setActiveTab] = useState('url'); // 'url' | 'text'
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Add source by URL
  const handleFetchUrl = async () => {
    if (!newUrl.trim()) return;
    setFetchError(null);
    setIsFetchingUrl(true);

    try {
      if (backendOnline) {
        const res = await fetch('/api/fetch-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: newUrl.trim() })
        });
        const data = await res.json();
        if (data.content) {
          const newSrc = {
            id: `src-${Date.now()}`,
            title: data.title || newTitle.trim() || new URL(newUrl).hostname,
            url: newUrl.trim(),
            date: data.date || newDate,
            type: 'webpage',
            content: data.content
          };
          setSources(prev => [...prev, newSrc]);
          setNewUrl('');
          setNewTitle('');
        } else {
          setFetchError(data.error || 'Failed to fetch content');
        }
      } else {
        // Fallback simulated fetch if backend not connected
        const hostname = new URL(newUrl).hostname;
        const newSrc = {
          id: `src-${Date.now()}`,
          title: newTitle.trim() || `${hostname} Document`,
          url: newUrl.trim(),
          date: newDate,
          type: 'webpage',
          content: `Fetched article from ${newUrl}. Please paste the raw contents below if the site blocks scraping.`
        };
        setSources(prev => [...prev, newSrc]);
        setNewUrl('');
        setNewTitle('');
      }
    } catch (err) {
      setFetchError(err.message || 'Scraping error');
    } finally {
      setIsFetchingUrl(false);
    }
  };

  // Add source by manual text paste
  const handleAddManualSource = () => {
    if (!newContent.trim()) return;
    const newSrc = {
      id: `src-${Date.now()}`,
      title: newTitle.trim() || `Manual Document ${sources.length + 1}`,
      url: newUrl.trim() || 'https://internal-doc.org',
      date: newDate,
      type: 'document',
      content: newContent.trim()
    };
    setSources(prev => [...prev, newSrc]);
    setNewTitle('');
    setNewContent('');
    setNewUrl('');
  };

  // Remove source
  const handleRemoveSource = (id) => {
    setSources(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl mb-8">
      
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
            Slide 3 Workflow Step 1 & 2
          </span>
          <h2 className="text-xl font-bold text-white mt-1.5">
            Configure Topic & Evidence Sources
          </h2>
          <p className="text-xs text-slate-400">
            Define the subject and provide the documents or URLs you want to cross-analyze for dark spots.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing || sources.length === 0}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 transition-all shadow-lg shadow-amber-950/40 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Analyzing Dark Spots...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Detect Information Gaps</span>
            </>
          )}
        </button>
      </div>

      {/* Inputs: Topic and Student Question / Research Goal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Topic or Opportunity Name
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. National Merit STEM Scholarship 2026"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Research Goal / Student Question</span>
            <span className="text-[10px] text-amber-400 font-medium">(Slide 5: "Student Asks")</span>
          </label>
          <input
            type="text"
            value={researchGoal}
            onChange={(e) => setResearchGoal(e.target.value)}
            placeholder="e.g. What should I verify before applying for this scholarship?"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Sources List */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <span>Attached Evidence Sources ({sources.length})</span>
            <span className="text-slate-500 text-[11px] font-normal">• Minimum 2 sources recommended to find conflicts</span>
          </label>
        </div>

        {sources.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/40">
            <p className="text-sm text-slate-400">No sources added yet. Attach at least one URL or document snippet below.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sources.map((src, idx) => {
              const isArchive = src.type === 'archive' || /2023|2024/i.test(src.date);

              return (
                <div
                  key={src.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isArchive
                      ? 'bg-amber-950/20 border-amber-900/50'
                      : 'bg-slate-950/80 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg mt-0.5 ${
                        isArchive ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {src.type === 'archive' ? <Archive className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{src.title}</h4>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isArchive 
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {src.type.toUpperCase()}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            {src.date}
                          </span>
                        </div>

                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1 font-mono break-all"
                        >
                          <span>{src.url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>

                        <p className="text-xs text-slate-300 mt-2 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 line-clamp-2 leading-relaxed">
                          {src.content}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveSource(src.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remove Source"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add New Source Section */}
      <div className="pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setActiveTab('url')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'url'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Add by URL / Permitted Search
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'text'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Paste Text Snippet / PDF Excerpt
          </button>
        </div>

        {activeTab === 'url' ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Source Title (optional)"
                className="px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
              />
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://example.gov/admissions-notice"
                className="sm:col-span-2 px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <span>Date:</span>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-white text-xs px-2 py-1 rounded"
                />
              </div>

              <button
                onClick={handleFetchUrl}
                disabled={isFetchingUrl || !newUrl.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 transition-colors disabled:opacity-50"
              >
                {isFetchingUrl ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                <span>Fetch & Extract Content</span>
              </button>
            </div>

            {fetchError && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fetchError}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Document / Excerpt Title"
                className="px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
              />
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <textarea
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Paste excerpt text, requirements list, guidelines paragraphs here..."
              className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
            ></textarea>

            <div className="flex justify-end">
              <button
                onClick={handleAddManualSource}
                disabled={!newContent.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Source Excerpt</span>
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
