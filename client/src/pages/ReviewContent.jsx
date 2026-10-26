import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  FileCheck,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  ArrowLeft,
  AlertOctagon,
  AlertTriangle,
  Info,
  ExternalLink,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { fetchContentDetail, recheckContent } from '../store/contentSlice';
import { SEVERITIES, FINDING_ORIGINS } from '../utils/constants';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

export default function ReviewContent() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, versions, findings, loading, reviewing, error } = useSelector(
    (state) => state.content
  );

  const [useAiForRecheck, setUseAiForRecheck] = useState(true);

  useEffect(() => {
    if (id) {
      dispatch(fetchContentDetail(id));
    }
  }, [dispatch, id]);

  const latestVersion = versions?.[0] || null;

  const handleRecheck = async () => {
    if (!latestVersion) return;
    const res = await dispatch(
      recheckContent({
        contentId: id,
        versionId: latestVersion.id,
        useAi: useAiForRecheck,
      })
    );
    if (!res.error) {
      toast.success('Draft re-checked against latest brand rules');
    } else {
      toast.error('Re-check failed');
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case SEVERITIES.BLOCKING:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300">
            <AlertOctagon className="w-3.5 h-3.5" />
            Blocking
          </span>
        );
      case SEVERITIES.SHOULD_FIX:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5" />
            Should Fix
          </span>
        );
      case SEVERITIES.SUGGESTION:
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-300">
            <Info className="w-3.5 h-3.5" />
            Suggestion
          </span>
        );
    }
  };

  if (loading) {
    return <Loading message="Loading draft content and findings..." rows={5} />;
  }

  if (error || !current) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <ErrorMessage
          message={error || 'Content draft not found'}
          onRetry={() => dispatch(fetchContentDetail(id))}
        />
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-teal hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/dashboard"
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 mr-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 font-mono font-semibold uppercase text-slate-700">
              {current.channel}
            </span>
            <StatusBadge status={current.status} />
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              v{current.currentVersion}
            </span>
            {latestVersion?.aiUsed ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                <Sparkles className="w-3 h-3" />
                AI Used (Gemini)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                <Cpu className="w-3 h-3" />
                Rule-based Only
              </span>
            )}
          </div>

          <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight mt-1">
            {current.title}
          </h1>
          <p className="text-xs text-slate-500">
            Created by <span className="font-semibold">{current.createdByName}</span> &bull; Draft ID: <span className="font-mono">{current.id}</span>
          </p>
        </div>

        {/* Re-check action */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-recheck-content"
            onClick={handleRecheck}
            disabled={reviewing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reviewing ? 'animate-spin' : ''}`} />
            {reviewing ? 'Checking...' : 'Check again'}
          </button>
        </div>
      </div>

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Draft Text (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Draft Content (Version {latestVersion?.number || 1})
              </span>
              <span className="text-[11px] font-mono text-slate-600">
                {latestVersion?.text?.length || 0} chars
              </span>
            </div>

            {/* Draft copy container */}
            <div
              id="draft-text-display"
              className="p-5 rounded-xl bg-slate-50 border border-slate-200 font-sans text-sm leading-relaxed text-slate-800 whitespace-pre-wrap select-text"
            >
              {latestVersion?.text || 'No text content in this version.'}
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
              <span>Rule &amp; AI verification runs against exact brand terms &amp; guidelines.</span>
              <span className="font-mono text-slate-600">Nimbus Coffee Co.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Findings List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-teal" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Detected Findings ({findings.length})
                </h2>
              </div>
              <span className="text-[11px] font-mono text-slate-600">
                Section 4 compliant
              </span>
            </div>

            {/* Findings List or Empty State */}
            {findings.length === 0 ? (
              <EmptyState
                title="No issues found"
                description="This draft does not have any flagged guideline violations. Note: This does not guarantee legal compliance."
                icon={CheckCircle2}
              />
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {findings.map((f) => (
                  <div
                    key={f.id}
                    id={`finding-card-${f.id}`}
                    className={`p-4 rounded-xl border transition space-y-2.5 ${
                      f.severity === SEVERITIES.BLOCKING
                        ? 'border-rose-200 bg-rose-50/40 hover:bg-rose-50/70'
                        : f.severity === SEVERITIES.SHOULD_FIX
                        ? 'border-amber-200 bg-amber-50/40 hover:bg-amber-50/70'
                        : 'border-blue-200 bg-blue-50/40 hover:bg-blue-50/70'
                    }`}
                  >
                    {/* Card Top: Severity, Type, Origin */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(f.severity)}
                        <span className="text-[11px] uppercase font-bold tracking-wider text-slate-600">
                          {f.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            f.origin === FINDING_ORIGINS.AI
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {f.origin}
                        </span>
                        {f.confidence && (
                          <span className="text-[10px] font-mono text-slate-500">
                            {Math.round(f.confidence * 100)}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body: Message */}
                    <p className="text-xs text-slate-800 font-medium leading-normal">
                      {f.message}
                    </p>

                    {/* Highlighted text preview */}
                    {f.span?.text && (
                      <div className="text-[11px] font-mono text-slate-600 bg-white/80 px-2 py-1 rounded border border-slate-200/80">
                        Flagged text: <strong className="text-slate-900">&ldquo;{f.span.text}&rdquo;</strong>
                      </div>
                    )}

                    {/* Suggested Fix */}
                    {f.suggestion && (
                      <div className="text-xs bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Suggested fix:</span>
                        <div className="font-semibold text-brand-teal">
                          {f.suggestion}
                        </div>
                      </div>
                    )}

                    {/* Source citation */}
                    {f.sourceRef && (
                      <div className="pt-1 flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-200/60">
                        <span className="font-medium text-slate-700 flex items-center gap-1">
                          Source: <strong>{f.sourceRef.label || f.sourceRef.code || f.sourceRef.kind}</strong>
                        </span>
                        {f.sourceRef.code && (
                          <span className="font-mono text-[10px] bg-slate-200/70 px-1.5 py-0.5 rounded">
                            {f.sourceRef.code}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
