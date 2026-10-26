import React from 'react';
import { History, GitCompare, Sparkles, Cpu, ChevronDown } from 'lucide-react';

export default function VersionPicker({
  versions = [],
  activeVersionNumber = 1,
  onSelectVersion = () => {},
  showDiff = false,
  onToggleDiff = () => {},
}) {
  if (!versions || versions.length === 0) return null;

  const hasMultipleVersions = versions.length > 1;

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1 px-2 text-slate-500 text-xs font-semibold">
          <History className="w-3.5 h-3.5 text-brand-teal" />
          <span className="hidden sm:inline">Version:</span>
        </div>

        {versions.map((v) => {
          const isActive = v.number === activeVersionNumber;
          return (
            <button
              key={v.id || v.number}
              type="button"
              onClick={() => onSelectVersion(v.number)}
              className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-brand-teal flex items-center gap-1.5 ${
                isActive
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
              aria-pressed={isActive}
            >
              <span>v{v.number}</span>
              {v.aiUsed && (
                <Sparkles className={`w-2.5 h-2.5 ${isActive ? 'text-brand-teal-light' : 'text-purple-600'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Compare Diff Toggle Button */}
      {hasMultipleVersions && (
        <button
          type="button"
          onClick={onToggleDiff}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border focus:outline-none focus:ring-2 focus:ring-brand-teal ${
            showDiff
              ? 'bg-teal-50 border-brand-teal text-brand-teal shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
          aria-pressed={showDiff}
        >
          <GitCompare className="w-3.5 h-3.5 text-brand-teal" />
          <span>{showDiff ? 'Hide Diff' : 'View Changes (Diff)'}</span>
        </button>
      )}
    </div>
  );
}
