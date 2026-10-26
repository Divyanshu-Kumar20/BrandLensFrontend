import React from 'react';
import { Sparkles, Cpu, Check, MessageSquare, AlertCircle } from 'lucide-react';
import SeverityBadge from './SeverityBadge';
import SourceChip from './SourceChip';
import { getConfidenceLevel } from '../utils/highlight';
import { FINDING_ORIGINS, SEVERITIES } from '../utils/constants';

export default function FindingCard({
  finding,
  isSelected = false,
  onSelect = () => {},
  actionSlot = null,
}) {
  if (!finding) return null;

  const confidenceLevel = getConfidenceLevel(finding.confidence);
  const isAi = finding.origin === FINDING_ORIGINS.AI;

  const getConfidenceBadge = (level) => {
    switch (level) {
      case 'High':
        return <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">High Confidence</span>;
      case 'Low':
        return <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">Low Confidence</span>;
      case 'Medium':
      default:
        return <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">Medium Confidence</span>;
    }
  };

  return (
    <div
      id={`finding-card-${finding.id}`}
      tabIndex={0}
      role="button"
      onClick={() => onSelect(finding.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(finding.id);
        }
      }}
      className={`p-4 rounded-xl border text-left transition-all duration-150 space-y-3 cursor-pointer outline-none ${
        isSelected
          ? 'ring-2 ring-brand-teal border-brand-teal bg-white shadow-md'
          : finding.severity === SEVERITIES.BLOCKING
          ? 'border-rose-200 bg-rose-50/30 hover:bg-white hover:border-rose-300 hover:shadow-xs'
          : finding.severity === SEVERITIES.SHOULD_FIX
          ? 'border-amber-200 bg-amber-50/30 hover:bg-white hover:border-amber-300 hover:shadow-xs'
          : 'border-blue-200 bg-blue-50/30 hover:bg-white hover:border-blue-300 hover:shadow-xs'
      }`}
      aria-pressed={isSelected}
    >
      {/* Top row: SeverityBadge, Type, Origin & Confidence */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <SeverityBadge severity={finding.severity} size="sm" />
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-600">
            {finding.type}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Origin Badge */}
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
              isAi
                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                : 'bg-slate-200 text-slate-700 border border-slate-300'
            }`}
          >
            {isAi ? <Sparkles className="w-2.5 h-2.5" /> : <Cpu className="w-2.5 h-2.5" />}
            {finding.origin}
          </span>

          {/* Confidence label: High, Medium, Low */}
          {getConfidenceBadge(confidenceLevel)}
        </div>
      </div>

      {/* Flagged text quote */}
      {finding.span?.text && (
        <div className="text-[11px] font-mono text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 flex items-center justify-between">
          <span className="truncate">
            Flagged: <strong className="text-slate-900">&ldquo;{finding.span.text}&rdquo;</strong>
          </span>
          <span className="text-[10px] text-slate-500 font-sans flex-shrink-0 ml-2">
            pos {finding.span.start}..{finding.span.end}
          </span>
        </div>
      )}

      {/* Explained Message */}
      <p className="text-xs text-slate-800 font-medium leading-relaxed">
        {finding.message}
      </p>

      {/* Suggested Fix */}
      {finding.suggestion && (
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Suggested Replacement:
          </span>
          <div className="text-xs font-bold text-brand-teal font-mono">
            {finding.suggestion}
          </div>
        </div>
      )}

      {/* SourceChip (popover with exact clause / fact) */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <SourceChip sourceRef={finding.sourceRef} />
        {finding.status && (
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
            {finding.status}
          </span>
        )}
      </div>

      {/* Optional action buttons slot (for Phase 5 resolution actions) */}
      {actionSlot && <div className="pt-2">{actionSlot}</div>}
    </div>
  );
}
