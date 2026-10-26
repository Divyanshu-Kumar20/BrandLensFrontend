import React, { useMemo, useState } from 'react';
import { diffWords } from 'diff';
import { GitCompare, Columns, AlignLeft, Plus, Minus, ArrowRight } from 'lucide-react';

export default function DiffView({
  oldText = '',
  newText = '',
  oldVersionNumber = 1,
  newVersionNumber = 2,
}) {
  const [viewMode, setViewMode] = useState('inline'); // 'inline' | 'split'

  const diffParts = useMemo(() => {
    return diffWords(oldText || '', newText || '');
  }, [oldText, newText]);

  const stats = useMemo(() => {
    let additions = 0;
    let removals = 0;
    diffParts.forEach((part) => {
      if (part.added) additions += part.value.trim().length > 0 ? 1 : 0;
      if (part.removed) removals += part.value.trim().length > 0 ? 1 : 0;
    });
    return { additions, removals };
  }, [diffParts]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Diff Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-brand-teal flex items-center justify-center">
            <GitCompare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-brand-navy flex items-center gap-2">
              <span>Version Diff Comparison</span>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                v{oldVersionNumber} <ArrowRight className="inline w-3 h-3 mx-0.5" /> v{newVersionNumber}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Showing exact text modifications applied by accepted brand fixes.
            </p>
          </div>
        </div>

        {/* Controls: stats & view mode */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="inline-flex items-center gap-0.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
              <Plus className="w-3 h-3" />
              {stats.additions} added
            </span>
            <span className="inline-flex items-center gap-0.5 text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-bold">
              <Minus className="w-3 h-3" />
              {stats.removals} removed
            </span>
          </div>

          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
            <button
              type="button"
              onClick={() => setViewMode('inline')}
              className={`p-1.5 rounded-md text-xs font-medium transition ${
                viewMode === 'inline'
                  ? 'bg-white shadow-xs text-brand-navy font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Inline unified diff"
              aria-label="Inline diff view"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`p-1.5 rounded-md text-xs font-medium transition ${
                viewMode === 'split'
                  ? 'bg-white shadow-xs text-brand-navy font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Split side-by-side diff"
              aria-label="Split diff view"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Inline Diff Container */}
      {viewMode === 'inline' ? (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-wrap select-text">
          {diffParts.map((part, index) => {
            if (part.added) {
              return (
                <ins
                  key={index}
                  className="bg-emerald-100/90 text-emerald-950 font-semibold px-1 py-0.5 rounded-xs border-b-2 border-emerald-500 no-underline"
                >
                  {part.value}
                </ins>
              );
            }
            if (part.removed) {
              return (
                <del
                  key={index}
                  className="bg-rose-100/90 text-rose-950 line-through opacity-75 px-1 py-0.5 rounded-xs border-b-2 border-rose-400"
                >
                  {part.value}
                </del>
              );
            }
            return <span key={index}>{part.value}</span>;
          })}
        </div>
      ) : (
        /* Split Diff Container */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed font-sans">
          {/* Before */}
          <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-200 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-rose-800 uppercase tracking-wider border-b border-rose-200/60 pb-1.5">
              <span>Before (v{oldVersionNumber})</span>
              <span className="font-mono text-slate-500">{oldText.length} chars</span>
            </div>
            <div className="whitespace-pre-wrap text-slate-800">
              {diffParts.map((part, index) => {
                if (part.added) return null; // Don't show added in "Before"
                if (part.removed) {
                  return (
                    <del key={index} className="bg-rose-200 text-rose-950 font-semibold px-0.5 rounded-xs line-through">
                      {part.value}
                    </del>
                  );
                }
                return <span key={index}>{part.value}</span>;
              })}
            </div>
          </div>

          {/* After */}
          <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 uppercase tracking-wider border-b border-emerald-200/60 pb-1.5">
              <span>After (v{newVersionNumber})</span>
              <span className="font-mono text-slate-500">{newText.length} chars</span>
            </div>
            <div className="whitespace-pre-wrap text-slate-800">
              {diffParts.map((part, index) => {
                if (part.removed) return null; // Don't show removed in "After"
                if (part.added) {
                  return (
                    <ins key={index} className="bg-emerald-200 text-emerald-950 font-bold px-0.5 rounded-xs no-underline">
                      {part.value}
                    </ins>
                  );
                }
                return <span key={index}>{part.value}</span>;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
