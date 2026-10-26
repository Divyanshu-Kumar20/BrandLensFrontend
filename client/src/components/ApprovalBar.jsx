import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Check,
  FileCheck,
  RotateCcw,
  AlertOctagon,
  Clock,
  Sparkles,
} from 'lucide-react';
import { submitContentForReview, approveContentWorkflow } from '../store/contentSlice';
import { ROLES, CONTENT_STATUS, SEVERITIES, FINDING_STATUS } from '../utils/constants';

export default function ApprovalBar({ content, findings = [] }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { workflowLoading, workflowError } = useSelector((state) => state.content);

  const [activeDecision, setActiveDecision] = useState(null); // 'approve' | 'request_changes' | 'reject'
  const [decisionNote, setDecisionNote] = useState('');

  if (!content) return null;

  const role = user?.role;
  const isCreator = role === ROLES.CREATOR || role === ROLES.ADMIN;
  const isReviewer = role === ROLES.REVIEWER || role === ROLES.ADMIN;
  const isManager = role === ROLES.MANAGER || role === ROLES.ADMIN;

  const currentStatus = content.status;

  // Check for open blocking findings
  const openBlockingFindings = findings.filter(
    (f) => f.severity === SEVERITIES.BLOCKING && f.status === FINDING_STATUS.OPEN
  );
  const hasOpenBlocking = openBlockingFindings.length > 0;

  // 1. Creator Submit Action
  const handleSubmitForReview = async () => {
    if (hasOpenBlocking) {
      toast.error('Cannot submit: Please resolve or dispute all blocking findings first.');
      return;
    }

    const result = await dispatch(
      submitContentForReview({
        contentId: content.id,
        userName: user?.name || 'Asha (Creator)',
      })
    );

    if (result.type === 'content/submitForReview/fulfilled') {
      toast.success('Draft submitted for Reviewer check!');
    } else {
      const errMsg = result.payload?.message || 'Failed to submit draft';
      toast.error(errMsg);
    }
  };

  // 2. Reviewer or Manager Decision Action
  const handleWorkflowDecision = async (e) => {
    e.preventDefault();
    if (!activeDecision) return;
    if (!decisionNote.trim()) {
      toast.error('A note explaining your decision is required.');
      return;
    }

    const result = await dispatch(
      approveContentWorkflow({
        contentId: content.id,
        decision: activeDecision,
        note: decisionNote.trim(),
        userName: user?.name || 'Reviewer',
        role,
      })
    );

    if (result.type === 'content/approveWorkflow/fulfilled') {
      const decisionLabel =
        activeDecision === 'approve'
          ? 'approved'
          : activeDecision === 'request_changes'
          ? 'sent back for changes'
          : 'rejected';
      toast.success(`Draft successfully ${decisionLabel}!`);
      setActiveDecision(null);
      setDecisionNote('');
    } else {
      const errMsg = result.payload?.message || 'Workflow decision failed';
      toast.error(errMsg);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      {/* 409 or Conflict Error Alert */}
      {workflowError && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-3 animate-in fade-in duration-200"
        >
          <AlertOctagon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-950">
              Workflow Status Conflict ({workflowError.code || '409 CONFLICT'})
            </div>
            <div className="text-amber-800">
              {workflowError.message ||
                'Resolve or dispute blocking findings first before submitting for review.'}
            </div>
          </div>
        </div>
      )}

      {/* Main Workflow Stage Container */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Workflow Status Indicator */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              currentStatus === CONTENT_STATUS.APPROVED
                ? 'bg-emerald-100 text-emerald-700'
                : currentStatus === CONTENT_STATUS.REJECTED
                ? 'bg-rose-100 text-rose-700'
                : currentStatus === CONTENT_STATUS.REVIEWER_APPROVED
                ? 'bg-teal-100 text-teal-700'
                : currentStatus === CONTENT_STATUS.IN_REVIEW
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {currentStatus === CONTENT_STATUS.APPROVED ? (
              <CheckCircle className="w-6 h-6" />
            ) : currentStatus === CONTENT_STATUS.REJECTED ? (
              <XCircle className="w-6 h-6" />
            ) : currentStatus === CONTENT_STATUS.IN_REVIEW ||
              currentStatus === CONTENT_STATUS.REVIEWER_APPROVED ? (
              <Clock className="w-6 h-6 animate-pulse" />
            ) : (
              <FileCheck className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Workflow Governance Stage
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-slate-100 text-slate-700">
                {currentStatus}
              </span>
            </div>

            <div className="text-sm font-bold text-brand-navy">
              {currentStatus === CONTENT_STATUS.DRAFT && 'Drafting Stage &bull; Pending Creator Submission'}
              {currentStatus === CONTENT_STATUS.CHANGES_REQUESTED && 'Changes Requested &bull; Returned to Creator'}
              {currentStatus === CONTENT_STATUS.IN_REVIEW && 'Stage 1: Pending Reviewer Approval'}
              {currentStatus === CONTENT_STATUS.REVIEWER_APPROVED && 'Stage 2: Pending Manager Final Sign-off'}
              {currentStatus === CONTENT_STATUS.APPROVED && 'Published &bull; All Governance Approvals Granted'}
              {currentStatus === CONTENT_STATUS.REJECTED && 'Archived &bull; Submission Rejected'}
            </div>
          </div>
        </div>

        {/* Right: Actions by Current Role */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          {/* CREATOR ACTION: Submit for review */}
          {isCreator && (currentStatus === CONTENT_STATUS.DRAFT || currentStatus === CONTENT_STATUS.CHANGES_REQUESTED) && (
            <div className="flex items-center gap-2">
              {hasOpenBlocking && (
                <span className="text-[11px] text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  {openBlockingFindings.length} open blocking violation{openBlockingFindings.length > 1 ? 's' : ''}
                </span>
              )}
              <button
                type="button"
                id="btn-submit-for-review"
                onClick={handleSubmitForReview}
                disabled={workflowLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
              >
                <Send className={`w-3.5 h-3.5 ${workflowLoading ? 'animate-spin' : ''}`} />
                <span>{workflowLoading ? 'Submitting...' : 'Submit for review'}</span>
              </button>
            </div>
          )}

          {/* REVIEWER ACTIONS: (when status is in_review) */}
          {isReviewer && currentStatus === CONTENT_STATUS.IN_REVIEW && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-reviewer-approve"
                onClick={() => {
                  setActiveDecision('approve');
                  setDecisionNote('');
                }}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
              >
                <Check className="w-3.5 h-3.5" />
                Approve (Stage 1)
              </button>

              <button
                type="button"
                id="btn-reviewer-changes"
                onClick={() => {
                  setActiveDecision('request_changes');
                  setDecisionNote('');
                }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Request changes
              </button>

              <button
                type="button"
                id="btn-reviewer-reject"
                onClick={() => {
                  setActiveDecision('reject');
                  setDecisionNote('');
                }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject
              </button>
            </div>
          )}

          {/* MANAGER ACTIONS: (when status is reviewer_approved) */}
          {isManager && currentStatus === CONTENT_STATUS.REVIEWER_APPROVED && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-manager-approve"
                onClick={() => {
                  setActiveDecision('approve');
                  setDecisionNote('');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold shadow-sm transition"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Final Manager Approval
              </button>

              <button
                type="button"
                id="btn-manager-changes"
                onClick={() => {
                  setActiveDecision('request_changes');
                  setDecisionNote('');
                }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Request changes
              </button>

              <button
                type="button"
                id="btn-manager-reject"
                onClick={() => {
                  setActiveDecision('reject');
                  setDecisionNote('');
                }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Decision Note Form Modal / Popover */}
      {activeDecision && (
        <form
          onSubmit={handleWorkflowDecision}
          className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>Required note for:</span>
              <span
                className={`font-mono font-extrabold capitalize ${
                  activeDecision === 'approve'
                    ? 'text-emerald-700'
                    : activeDecision === 'request_changes'
                    ? 'text-amber-700'
                    : 'text-rose-700'
                }`}
              >
                {activeDecision.replace('_', ' ')}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setActiveDecision(null)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <textarea
            required
            rows={2}
            value={decisionNote}
            onChange={(e) => setDecisionNote(e.target.value)}
            placeholder="Type your explanation or rationale for this decision..."
            className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal bg-white"
            autoFocus
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setActiveDecision(null)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={workflowLoading || !decisionNote.trim()}
              className="px-4 py-1.5 text-xs font-bold bg-brand-navy hover:bg-brand-navy-light text-white rounded-lg shadow-sm disabled:opacity-40"
            >
              {workflowLoading ? 'Recording...' : 'Confirm Decision'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
