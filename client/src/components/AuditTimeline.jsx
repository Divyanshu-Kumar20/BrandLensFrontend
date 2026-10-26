import React from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Send,
  FilePlus,
  Layers,
  ShieldCheck,
  User,
  MessageSquare,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function AuditTimeline({ audit = [] }) {
  if (!audit || audit.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-xs italic">
        No audit events recorded for this content draft yet.
      </div>
    );
  }

  const getActionConfig = (action, meta = {}) => {
    switch (action) {
      case 'DRAFT_CREATED':
        return {
          label: 'Initial Draft Created',
          icon: FilePlus,
          badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
          dotColor: 'bg-teal-500',
        };
      case 'VERSION_CREATED':
        return {
          label: `Saved Version ${meta.versionNumber || ''}`,
          icon: Layers,
          badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          dotColor: 'bg-indigo-500',
        };
      case 'SUBMITTED_FOR_REVIEW':
        return {
          label: 'Submitted for Governance Review',
          icon: Send,
          badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
          dotColor: 'bg-blue-500',
        };
      case 'WORKFLOW_APPROVE':
        return {
          label: meta.stage === 'manager' ? 'Final Manager Approval Granted' : 'Stage 1 Reviewer Approved',
          icon: CheckCircle,
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          dotColor: 'bg-emerald-500',
        };
      case 'WORKFLOW_REQUEST_CHANGES':
        return {
          label: 'Changes Requested & Returned',
          icon: RotateCcw,
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
          dotColor: 'bg-amber-500',
        };
      case 'WORKFLOW_REJECT':
        return {
          label: 'Draft Submission Rejected',
          icon: XCircle,
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
          dotColor: 'bg-rose-500',
        };
      default:
        return {
          label: action.replace(/_/g, ' '),
          icon: Clock,
          badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
          dotColor: 'bg-slate-500',
        };
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-teal" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Governance Audit Trail ({audit.length} Event{audit.length > 1 ? 's' : ''})
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">Immutable Compliance Log</span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {audit.map((entry, index) => {
          const config = getActionConfig(entry.action, entry.meta);
          const Icon = config.icon;
          const meta = entry.meta || {};

          return (
            <div key={entry.id || index} className="relative group">
              {/* Dot Icon */}
              <div
                className={`absolute -left-[27px] top-0.5 w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white ${config.dotColor}`}
              >
                <Icon className="w-3 h-3" />
              </div>

              {/* Event Content */}
              <div className="bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider ${config.badgeColor}`}
                    >
                      {config.label}
                    </span>
                    {meta.resultingStatus && (
                      <span className="text-[11px] flex items-center gap-1 text-slate-500 font-medium">
                        &rarr; <StatusBadge status={meta.resultingStatus} />
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    {formatDate(entry.at || entry.timestamp || entry.createdAt)}
                  </span>
                </div>

                <div className="text-xs text-slate-700 flex items-center gap-1.5 font-medium">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Action performed by:</span>
                  <span className="font-bold text-slate-900">{entry.userName || 'System'}</span>
                </div>

                {/* Note / Rationale */}
                {meta.note && (
                  <div className="mt-2 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg p-2.5 space-y-1">
                    <div className="flex items-center gap-1 font-semibold text-[11px] text-slate-500">
                      <MessageSquare className="w-3 h-3 text-brand-teal" />
                      <span>Decision Rationale / Note:</span>
                    </div>
                    <p className="italic font-sans text-slate-800">{meta.note}</p>
                  </div>
                )}

                {/* Additional metadata tags if available */}
                {meta.versionNumber && (
                  <div className="text-[11px] font-mono text-slate-500">
                    Target version: v{meta.versionNumber}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
