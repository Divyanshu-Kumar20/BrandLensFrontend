import React, { useState } from 'react';
import {
  Sparkles,
  Cpu,
  Check,
  Edit2,
  ShieldAlert,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  X,
  MessageSquare,
} from 'lucide-react';
import SeverityBadge from './SeverityBadge';
import SourceChip from './SourceChip';
import { getConfidenceLevel } from '../utils/highlight';
import { FINDING_ORIGINS, FINDING_STATUS, SEVERITIES } from '../utils/constants';

export default function FindingCard({
  finding,
  isSelected = false,
  onSelect = () => {},
  onAccept = () => {},
  onEdit = () => {},
  onDispute = () => {},
  canAct = true,
}) {
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [editedText, setEditedText] = useState(finding?.suggestion || '');
  const [isDisputing, setIsDisputing] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  if (!finding) return null;

  const confidenceLevel = getConfidenceLevel(finding.confidence);
  const isAi = finding.origin === FINDING_ORIGINS.AI;
  const status = finding.status || FINDING_STATUS.OPEN;
  const isResolved = status !== FINDING_STATUS.OPEN;

  const handleSaveEdit = (e) => {
    e.stopPropagation();
    if (!editedText.trim()) return;
    onEdit(finding, editedText.trim());
    setIsEditingInline(false);
  };

  const handleSaveDispute = (e) => {
    e.stopPropagation();
    if (!disputeReason.trim()) return;
    onDispute(finding, disputeReason.trim());
    setIsDisputing(false);
  };

  const getStatusBadge = () => {
    switch (status) {
      case FINDING_STATUS.ACCEPTED:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Fix Accepted
          </span>
        );
      case FINDING_STATUS.EDITED:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full border border-teal-300">
            <Edit2 className="w-3 h-3 text-brand-teal" />
            Custom Fix Accepted
          </span>
        );
      case FINDING_STATUS.DISPUTED:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-300">
            <ShieldAlert className="w-3 h-3 text-purple-600" />
            Disputed
          </span>
        );
      case FINDING_STATUS.DISMISSED:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
            Dismissed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id={`finding-card-${finding.id}`}
      tabIndex={0}
      role="region"
      aria-label={`Finding ${finding.id}: ${finding.message}`}
      onClick={() => onSelect(finding.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target.id === `finding-card-${finding.id}`) {
          onSelect(finding.id);
        }
      }}
      className={`p-4 rounded-xl border text-left transition-all duration-150 space-y-3 cursor-pointer outline-none ${
        isSelected
          ? 'ring-2 ring-brand-teal border-brand-teal bg-white shadow-md'
          : status === FINDING_STATUS.ACCEPTED || status === FINDING_STATUS.EDITED
          ? 'border-emerald-200 bg-emerald-50/20'
          : status === FINDING_STATUS.DISPUTED
          ? 'border-purple-200 bg-purple-50/20'
          : finding.severity === SEVERITIES.BLOCKING
          ? 'border-rose-200 bg-rose-50/30 hover:bg-white hover:border-rose-300'
          : finding.severity === SEVERITIES.SHOULD_FIX
          ? 'border-amber-200 bg-amber-50/30 hover:bg-white hover:border-amber-300'
          : 'border-blue-200 bg-blue-50/30 hover:bg-white hover:border-blue-300'
      }`}
    >
      {/* Top Header: Severity, Category, Origin & Confidence */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <SeverityBadge severity={finding.severity} size="sm" />
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-600">
            {finding.type}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {getStatusBadge()}

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

          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
            {confidenceLevel}
          </span>
        </div>
      </div>

      {/* Flagged text snippet */}
      {finding.span?.text && (
        <div className="text-[11px] font-mono text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 flex items-center justify-between">
          <span className="truncate">
            Flagged text: <strong className="text-slate-900">&ldquo;{finding.span.text}&rdquo;</strong>
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

      {/* Dispute Reason Display (if already disputed) */}
      {status === FINDING_STATUS.DISPUTED && finding.disputeReason && (
        <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-900 space-y-1">
          <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider flex items-center gap-1">
            <MessageSquare className="w-3 h-3" /> Dispute Reason Stated:
          </span>
          <div className="italic">&ldquo;{finding.disputeReason}&rdquo;</div>
        </div>
      )}

      {/* Suggested Fix / Inline Edit */}
      {finding.suggestion && (
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              {status === FINDING_STATUS.EDITED ? 'Applied Custom Fix:' : 'Suggested Replacement:'}
            </span>
            {canAct && !isResolved && !isEditingInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingInline(true);
                  setIsDisputing(false);
                }}
                className="text-[11px] font-bold text-brand-teal hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" /> Edit inline
              </button>
            )}
          </div>

          {isEditingInline ? (
            <div className="pt-1 space-y-2" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                placeholder="Type customized fix..."
                className="w-full px-2.5 py-1.5 text-xs border border-brand-teal rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal bg-white font-mono"
                autoFocus
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingInline(false)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={!editedText.trim()}
                  className="px-3 py-1 text-[11px] font-bold bg-brand-teal text-white rounded hover:bg-brand-teal-dark shadow-xs"
                >
                  Save &amp; Accept Fix
                </button>
              </div>
            </div>
          ) : (
            <div className="text-xs font-bold text-brand-teal font-mono">
              {finding.suggestion}
            </div>
          )}
        </div>
      )}

      {/* Dispute Reason Form (when disputing) */}
      {isDisputing && (
        <div
          className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2 text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-purple-900 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
              Reason for Dispute (Required)
            </span>
            <button
              type="button"
              onClick={() => setIsDisputing(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <textarea
            rows={2}
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
            placeholder="e.g. We have approved laboratory test certification from Q3 2026."
            className="w-full p-2 text-xs border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsDisputing(false)}
              className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-purple-100 rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              id={`btn-submit-dispute-${finding.id}`}
              onClick={handleSaveDispute}
              disabled={!disputeReason.trim()}
              className="px-3 py-1 text-[11px] font-bold bg-purple-700 hover:bg-purple-800 text-white rounded shadow-xs disabled:opacity-40"
            >
              Confirm Dispute
            </button>
          </div>
        </div>
      )}

      {/* Source Citation & Actions Footer */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <SourceChip sourceRef={finding.sourceRef} />

        {/* Action Buttons for Creator (Accept, Edit, Dispute) */}
        {canAct && !isResolved && !isEditingInline && !isDisputing && (
          <div className="flex items-center gap-1.5 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              id={`btn-accept-${finding.id}`}
              onClick={() => onAccept(finding)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title="Accept suggested replacement into the next draft version"
            >
              <Check className="w-3 h-3" />
              Accept fix
            </button>

            <button
              type="button"
              id={`btn-edit-${finding.id}`}
              onClick={() => {
                setIsEditingInline(true);
                setIsDisputing(false);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition focus:outline-none focus:ring-2 focus:ring-brand-teal"
              title="Edit the suggested replacement before accepting"
            >
              <Edit2 className="w-3 h-3 text-slate-500" />
              Edit
            </button>

            <button
              type="button"
              id={`btn-dispute-${finding.id}`}
              onClick={() => {
                setIsDisputing(true);
                setIsEditingInline(false);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
              title="Dispute this finding with an approved justification"
            >
              <ShieldAlert className="w-3 h-3 text-purple-600" />
              Dispute
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
