import React, { useMemo } from 'react';
import { AlertTriangle, AlertOctagon, Info, CheckCircle2, Sparkles, Save, Layers } from 'lucide-react';
import FindingCard from './FindingCard';
import EmptyState from './EmptyState';
import { SEVERITIES, FINDING_STATUS } from '../utils/constants';

export default function FindingsPanel({
  findings = [],
  selectedFindingId = null,
  onSelectFinding = () => {},
  aiFailed = false,
  onAcceptFinding = () => {},
  onEditFinding = () => {},
  onDisputeFinding = () => {},
  canAct = true,
  pendingFixesCount = 0,
  onSaveNewVersion = () => {},
  savingVersion = false,
}) {
  // Group findings by severity (blocking first, then should_fix, then suggestion)
  const grouped = useMemo(() => {
    const blocking = [];
    const shouldFix = [];
    const suggestion = [];

    findings.forEach((f) => {
      if (f.severity === SEVERITIES.BLOCKING) {
        blocking.push(f);
      } else if (f.severity === SEVERITIES.SHOULD_FIX) {
        shouldFix.push(f);
      } else {
        suggestion.push(f);
      }
    });

    return [
      { id: 'blocking', label: 'Blocking Violations', severity: SEVERITIES.BLOCKING, items: blocking, icon: AlertOctagon, color: 'text-rose-700 bg-rose-50 border-rose-200' },
      { id: 'should_fix', label: 'Should Fix', severity: SEVERITIES.SHOULD_FIX, items: shouldFix, icon: AlertTriangle, color: 'text-amber-800 bg-amber-50 border-amber-200' },
      { id: 'suggestion', label: 'Suggestions', severity: SEVERITIES.SUGGESTION, items: suggestion, icon: Info, color: 'text-blue-700 bg-blue-50 border-blue-200' },
    ];
  }, [findings]);

  const handleCardSelect = (findingId) => {
    onSelectFinding(findingId);
    const highlightEl = document.getElementById(`text-highlight-${findingId}`);
    if (highlightEl) {
      highlightEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      highlightEl.focus({ preventScroll: true });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Notice when AI failed */}
      {aiFailed && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span className="font-semibold">
            AI review was unavailable, rule checks only.
          </span>
        </div>
      )}

      {/* Header and counter */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <span>Brand Findings</span>
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
            {findings.length}
          </span>
        </h2>

        {/* Save as new version button */}
        {canAct && pendingFixesCount > 0 && (
          <button
            type="button"
            id="btn-save-new-version"
            onClick={onSaveNewVersion}
            disabled={savingVersion}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 animate-pulse hover:animate-none"
          >
            <Save className={`w-3.5 h-3.5 ${savingVersion ? 'animate-spin' : ''}`} />
            <span>
              {savingVersion ? 'Creating v...' : `Save as new version (${pendingFixesCount} fix${pendingFixesCount > 1 ? 'es' : ''})`}
            </span>
          </button>
        )}
      </div>

      {/* Helper text */}
      <p className="text-[11px] text-slate-500 leading-normal">
        The draft copy never changes automatically. Choose <strong>Accept fix</strong>, <strong>Edit</strong>, or <strong>Dispute</strong> with a justification, then save a new version to re-check.
      </p>

      {/* Findings List or Empty State */}
      {findings.length === 0 ? (
        <EmptyState
          title="No issues found"
          description="This draft does not have any flagged guideline violations. Note: This does not guarantee legal compliance."
          icon={CheckCircle2}
        />
      ) : (
        <div className="space-y-6 max-h-[720px] overflow-y-auto pr-1">
          {grouped.map((group) => {
            if (group.items.length === 0) return null;
            const Icon = group.icon;

            return (
              <section key={group.id} className="space-y-2.5" aria-labelledby={`group-title-${group.id}`}>
                <div className={`px-3 py-1.5 rounded-lg border flex items-center justify-between text-xs font-bold ${group.color}`}>
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    <span id={`group-title-${group.id}`}>{group.label}</span>
                  </div>
                  <span className="font-mono text-[11px]">{group.items.length}</span>
                </div>

                <div className="space-y-2.5">
                  {group.items.map((finding) => (
                    <FindingCard
                      key={finding.id}
                      finding={finding}
                      isSelected={selectedFindingId === finding.id}
                      onSelect={() => handleCardSelect(finding.id)}
                      onAccept={onAcceptFinding}
                      onEdit={onEditFinding}
                      onDispute={onDisputeFinding}
                      canAct={canAct}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
