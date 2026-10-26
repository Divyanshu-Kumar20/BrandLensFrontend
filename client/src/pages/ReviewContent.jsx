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
  Cpu,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';
import { fetchContentDetail, recheckContent } from '../store/contentSlice';
import StatusBadge from '../components/StatusBadge';
import HighlightedText from '../components/HighlightedText';
import FindingsPanel from '../components/FindingsPanel';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function ReviewContent() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, versions, findings, loading, reviewing, error } = useSelector(
    (state) => state.content
  );

  const [selectedFindingId, setSelectedFindingId] = useState(null);
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
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 font-mono font-semibold uppercase text-slate-700">
              {current.channel}
            </span>
            <StatusBadge status={current.status} />
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              v{current.currentVersion}
            </span>
            {latestVersion?.aiUsed ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                <Sparkles className="w-3 h-3 text-purple-600" />
                AI Used (Gemini)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                <Cpu className="w-3 h-3 text-slate-500" />
                Rule checks only
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

        {/* Re-check action & AI toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
            <input
              type="checkbox"
              checked={useAiForRecheck}
              onChange={(e) => setUseAiForRecheck(e.target.checked)}
              className="rounded text-brand-teal focus:ring-brand-teal"
            />
            <span>Include AI check</span>
          </label>

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

      {/* Main Review Grid: HighlightedText (left) and FindingsPanel (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Draft Text with Interactive Highlights */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-brand-teal" />
                Draft Copy (Version {latestVersion?.number || 1})
              </span>
              <span className="text-[11px] font-mono text-slate-600">
                {latestVersion?.text?.length || 0} characters
              </span>
            </div>

            {/* Highlighted text component */}
            <HighlightedText
              text={latestVersion?.text || ''}
              findings={findings}
              selectedFindingId={selectedFindingId}
              onSelectFinding={setSelectedFindingId}
            />

            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
              <span>Click any highlighted span to view its exact guideline citation.</span>
              <span className="font-mono text-slate-600">Nimbus Coffee Co.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Findings Panel grouped by Severity */}
        <div className="lg:col-span-5 space-y-4">
          <FindingsPanel
            findings={findings}
            selectedFindingId={selectedFindingId}
            onSelectFinding={setSelectedFindingId}
            aiFailed={latestVersion?.aiFailed || false}
          />
        </div>
      </div>
    </div>
  );
}
