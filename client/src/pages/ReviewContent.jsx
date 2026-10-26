import React, { useEffect, useState, useMemo } from 'react';
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
  Save,
  CheckCircle,
  GitCompare,
  AlertOctagon,
  Info,
} from 'lucide-react';
import {
  fetchContentDetail,
  recheckContent,
  patchFindingStatus,
  saveNewVersionAndReview,
} from '../store/contentSlice';
import { ROLES, FINDING_STATUS, SEVERITIES } from '../utils/constants';
import StatusBadge from '../components/StatusBadge';
import HighlightedText from '../components/HighlightedText';
import FindingsPanel from '../components/FindingsPanel';
import DiffView from '../components/DiffView';
import VersionPicker from '../components/VersionPicker';
import ApprovalBar from '../components/ApprovalBar';
import CommentThread from '../components/CommentThread';
import AuditTimeline from '../components/AuditTimeline';
import AiDisclosureBanner from '../components/AiDisclosureBanner';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import usePageTitle from '../utils/usePageTitle';

export default function ReviewContent() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    current,
    versions,
    findings,
    comments,
    audit,
    loading,
    reviewing,
    savingVersion,
    error,
  } = useSelector((state) => state.content);

  usePageTitle(current?.title ? `Review: ${current.title}` : 'Review Draft');

  const [selectedFindingId, setSelectedFindingId] = useState(null);
  const [activeVersionNumber, setActiveVersionNumber] = useState(null);
  const [useAiForRecheck, setUseAiForRecheck] = useState(true);
  const [showDiff, setShowDiff] = useState(false);
  const [pendingFixes, setPendingFixes] = useState([]); // [{ findingId, replacement }]

  useEffect(() => {
    if (id) {
      dispatch(fetchContentDetail(id));
    }
  }, [dispatch, id]);

  // Set default active version to latest version when loaded
  useEffect(() => {
    if (versions && versions.length > 0 && activeVersionNumber === null) {
      setActiveVersionNumber(versions[0].number);
    }
  }, [versions, activeVersionNumber]);

  const activeVersion = useMemo(() => {
    if (!versions || versions.length === 0) return null;
    return versions.find((v) => v.number === activeVersionNumber) || versions[0];
  }, [versions, activeVersionNumber]);

  // Previous version for diff
  const previousVersion = useMemo(() => {
    if (!versions || versions.length < 2) return null;
    // Versions are sorted descending: [v2, v1]
    const currentIndex = versions.findIndex((v) => v.number === activeVersion?.number);
    if (currentIndex !== -1 && currentIndex + 1 < versions.length) {
      return versions[currentIndex + 1];
    }
    return versions[versions.length - 1];
  }, [versions, activeVersion]);

  const canAct = user?.role === ROLES.CREATOR || user?.role === ROLES.ADMIN;

  // Re-check
  const handleRecheck = async () => {
    if (!activeVersion) return;
    const res = await dispatch(
      recheckContent({
        contentId: id,
        versionId: activeVersion.id,
        useAi: useAiForRecheck,
      })
    );
    if (!res.error) {
      toast.success('Draft re-checked against latest brand rules');
    } else {
      toast.error('Re-check failed');
    }
  };

  // Accept fix handler
  const handleAcceptFinding = async (finding) => {
    const result = await dispatch(
      patchFindingStatus({
        findingId: finding.id,
        status: FINDING_STATUS.ACCEPTED,
        resolvedByName: user?.name || 'Creator',
      })
    );

    if (!result.error) {
      // Add or update in pendingFixes
      setPendingFixes((prev) => {
        const filtered = prev.filter((item) => item.findingId !== finding.id);
        return [...filtered, { findingId: finding.id, replacement: finding.suggestion }];
      });
      toast.success(`Fix accepted: "${finding.suggestion}"`);
    } else {
      toast.error(result.payload || 'Failed to accept fix');
    }
  };

  // Inline edit fix handler
  const handleEditFinding = async (finding, customReplacement) => {
    const result = await dispatch(
      patchFindingStatus({
        findingId: finding.id,
        status: FINDING_STATUS.EDITED,
        editedText: customReplacement,
        resolvedByName: user?.name || 'Creator',
      })
    );

    if (!result.error) {
      setPendingFixes((prev) => {
        const filtered = prev.filter((item) => item.findingId !== finding.id);
        return [...filtered, { findingId: finding.id, replacement: customReplacement }];
      });
      toast.success(`Custom fix saved: "${customReplacement}"`);
    } else {
      toast.error(result.payload || 'Failed to save edit');
    }
  };

  // Dispute finding handler
  const handleDisputeFinding = async (finding, reason) => {
    const result = await dispatch(
      patchFindingStatus({
        findingId: finding.id,
        status: FINDING_STATUS.DISPUTED,
        disputeReason: reason,
        resolvedByName: user?.name || 'Creator',
      })
    );

    if (!result.error) {
      // Disputes do not alter text, remove from pendingFixes if present
      setPendingFixes((prev) => prev.filter((item) => item.findingId !== finding.id));
      toast.success('Dispute recorded with justification');
    } else {
      toast.error(result.payload || 'Failed to dispute finding');
    }
  };

  // Save as new version
  const handleSaveNewVersion = async () => {
    if (pendingFixes.length === 0) {
      toast.error('No accepted fixes to apply.');
      return;
    }

    if (!activeVersion) return;

    const result = await dispatch(
      saveNewVersionAndReview({
        contentId: id,
        basedOnVersionId: activeVersion.id,
        fixes: pendingFixes,
        useAi: useAiForRecheck,
      })
    );

    if (!result.error) {
      const createdVersion = result.payload.newVersion;
      setPendingFixes([]);
      setActiveVersionNumber(createdVersion.number);
      setShowDiff(true); // Automatically show diff after saving!
      toast.success(`Version ${createdVersion.number} created and verified!`);
    } else {
      toast.error(result.payload || 'Failed to save new version');
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

  const openBlockingCount = findings.filter(
    (f) => f.severity === SEVERITIES.BLOCKING && f.status === FINDING_STATUS.OPEN
  ).length;

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

            {/* Version Picker */}
            <VersionPicker
              versions={versions}
              activeVersionNumber={activeVersion?.number || 1}
              onSelectVersion={(num) => {
                setActiveVersionNumber(num);
                setSelectedFindingId(null);
              }}
              showDiff={showDiff}
              onToggleDiff={() => setShowDiff((prev) => !prev)}
            />

            {activeVersion?.aiUsed ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                <Sparkles className="w-3 h-3 text-purple-600" />
                AI Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                <Cpu className="w-3 h-3 text-slate-500" />
                Rule-only
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

        {/* Top actions & Recheck */}
        <div className="flex flex-wrap items-center gap-3">
          {canAct && pendingFixes.length > 0 && (
            <button
              type="button"
              id="top-btn-save-version"
              onClick={handleSaveNewVersion}
              disabled={savingVersion}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <Save className={`w-3.5 h-3.5 ${savingVersion ? 'animate-spin' : ''}`} />
              <span>Save as v{(versions?.[0]?.number || 1) + 1} ({pendingFixes.length} fix{pendingFixes.length > 1 ? 'es' : ''})</span>
            </button>
          )}

          <label className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
            <input
              type="checkbox"
              checked={useAiForRecheck}
              onChange={(e) => setUseAiForRecheck(e.target.checked)}
              className="rounded text-brand-teal focus:ring-brand-teal"
            />
            <span>AI check</span>
          </label>

          <button
            type="button"
            id="btn-recheck-content"
            onClick={handleRecheck}
            disabled={reviewing || savingVersion}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reviewing ? 'animate-spin' : ''}`} />
            <span>{reviewing ? 'Checking...' : 'Check again'}</span>
          </button>
        </div>
      </div>

      {/* First-time user guide callout */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-900">How to review &amp; resolve findings:</span>
            <p className="text-slate-600">
              Click highlights or finding cards to inspect violations. Click <strong>Accept fix</strong> or <strong>Edit</strong> to prepare replacements, or <strong>Dispute</strong> with a justification. Once resolved, click <strong>Save as new version</strong> to regenerate draft copy without overwriting history.
            </p>
          </div>
        </div>
      </div>

      {/* Compact AI Disclosure Banner */}
      <AiDisclosureBanner compact={true} />

      {/* Role-based Approval Workflow Bar */}
      <ApprovalBar content={current} findings={findings} />

      {/* Diff View (if toggled or multiple versions available) */}
      {showDiff && previousVersion && activeVersion && (
        <DiffView
          oldText={previousVersion.text}
          newText={activeVersion.text}
          oldVersionNumber={previousVersion.number}
          newVersionNumber={activeVersion.number}
        />
      )}

      {/* Main Review Grid: HighlightedText (left) and FindingsPanel (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Draft Text with Interactive Highlights */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-brand-teal" />
                Draft Copy (Version {activeVersion?.number || 1})
              </span>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                <span>{activeVersion?.text?.length || 0} characters</span>
                {openBlockingCount > 0 ? (
                  <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-bold">
                    {openBlockingCount} blocking open
                  </span>
                ) : (
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                    All blocking resolved
                  </span>
                )}
              </div>
            </div>

            {/* Highlighted text component */}
            <HighlightedText
              text={activeVersion?.text || ''}
              findings={findings}
              selectedFindingId={selectedFindingId}
              onSelectFinding={setSelectedFindingId}
            />

            <div className="text-[11px] text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between pt-1 gap-1">
              <span>Click any highlighted segment to view or act on the finding card.</span>
              <span className="font-mono text-slate-400">Nimbus Coffee Co. Brand Standards</span>
            </div>
          </div>
        </div>

        {/* Right Column: Findings Panel grouped by Severity */}
        <div className="lg:col-span-5 space-y-4">
          <FindingsPanel
            findings={findings}
            selectedFindingId={selectedFindingId}
            onSelectFinding={setSelectedFindingId}
            aiFailed={activeVersion?.aiFailed || false}
            onAcceptFinding={handleAcceptFinding}
            onEditFinding={handleEditFinding}
            onDisputeFinding={handleDisputeFinding}
            canAct={canAct}
            pendingFixesCount={pendingFixes.length}
            onSaveNewVersion={handleSaveNewVersion}
            savingVersion={savingVersion}
          />
        </div>
      </div>

      {/* Discussion & Audit Trail Bottom Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        <CommentThread
          contentId={id}
          findings={findings}
          selectedFindingId={selectedFindingId}
        />
        <AuditTimeline audit={audit} />
      </div>
    </div>
  );
}
