import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  FileText,
  Filter,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Share2,
  Mail,
  Globe,
  Presentation,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Info,
} from 'lucide-react';
import { fetchContentList } from '../store/contentSlice';
import { ROLES, CONTENT_STATUS, CHANNELS } from '../utils/constants';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import usePageTitle from '../utils/usePageTitle';

const channelIcons = {
  [CHANNELS.SOCIAL]: Share2,
  [CHANNELS.EMAIL]: Mail,
  [CHANNELS.WEB]: Globe,
  [CHANNELS.DECK]: Presentation,
};

export default function Dashboard() {
  usePageTitle('Dashboard');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { list, loading, error } = useSelector((state) => state.content);

  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    dispatch(fetchContentList(statusFilter === 'ALL' ? undefined : statusFilter));
  }, [dispatch, statusFilter]);

  const canCreateContent = user?.role === ROLES.CREATOR || user?.role === ROLES.ADMIN;
  const isAdmin = user?.role === ROLES.ADMIN;
  const isReviewer = user?.role === ROLES.REVIEWER;
  const isManager = user?.role === ROLES.MANAGER;
  const canReview = isReviewer || isManager || isAdmin;

  // "Waiting for you" items
  const waitingItems = list.filter((item) => {
    if (isReviewer) return item.status === CONTENT_STATUS.IN_REVIEW;
    if (isManager) return item.status === CONTENT_STATUS.REVIEWER_APPROVED;
    if (isAdmin) {
      return (
        item.status === CONTENT_STATUS.IN_REVIEW ||
        item.status === CONTENT_STATUS.REVIEWER_APPROVED
      );
    }
    return false;
  });

  const filteredList =
    statusFilter === 'ALL'
      ? list
      : list.filter((item) => item.status === statusFilter);

  const formatDate = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome / Actions Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
              Nimbus Coffee Co. &bull; Brand Governance
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight">
            Marketing Drafts Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review and govern marketing communications across all touchpoints prior to external publishing.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {canCreateContent ? (
            <Link
              to="/new"
              id="btn-new-content"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-light flex-1 sm:flex-initial"
            >
              <PlusCircle className="w-4 h-4" />
              New Content
            </Link>
          ) : (
            <div className="text-[11px] text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              Only Creators &amp; Admins can draft new copy
            </div>
          )}

          <Link
            to="/knowledge"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <BookOpen className="w-4 h-4 text-brand-teal" />
            Brand Rules
          </Link>
        </div>
      </div>

      {/* First-time user guide callout */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-900">How Brand Governance Works in BrandLens:</span>
            <p className="text-slate-600">
              1. <strong>Draft</strong> copy &bull; 2. <strong>Inspect</strong> rule &amp; Gemini AI findings &bull; 3. <strong>Accept / Edit / Dispute</strong> &bull; 4. <strong>Stage 1 Reviewer</strong> check &bull; 5. <strong>Stage 2 Manager</strong> final sign-off.
            </p>
          </div>
        </div>
      </div>

      {/* Reviewer / Manager "Waiting for you" section */}
      {canReview && (
        <section aria-labelledby="waiting-for-you-title">
          <div className="bg-gradient-to-r from-blue-900 to-brand-navy text-white rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-teal-light animate-pulse" />
                <h2 id="waiting-for-you-title" className="text-sm font-bold tracking-tight">
                  Waiting for your sign-off
                </h2>
              </div>
              <span className="text-xs font-mono bg-white/20 px-2 py-0.5 rounded-full text-white">
                {waitingItems.length} awaiting action
              </span>
            </div>

            {waitingItems.length === 0 ? (
              <p className="text-xs text-slate-300">
                You are all caught up! No drafts are currently awaiting your sign-off.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {waitingItems.map((item) => (
                  <Link
                    key={item.id}
                    to={`/content/${item.id}`}
                    className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl p-3.5 transition group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-brand-teal-light mb-1">
                        <span className="capitalize">{item.channel}</span>
                        <span className="font-mono">v{item.currentVersion}</span>
                      </div>
                      <h3 className="text-xs font-bold text-white group-hover:text-brand-light transition">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-slate-300 mt-1">
                        Created by {item.createdByName}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-medium">
                      <span className="text-amber-300 font-mono text-[10px] uppercase font-bold">
                        {item.status === CONTENT_STATUS.IN_REVIEW
                          ? 'Stage 1: Reviewer'
                          : 'Stage 2: Manager'}
                      </span>
                      <span className="text-emerald-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Review now &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Content Table / Main List Container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Filter by Status:
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'ALL', label: 'All Items' },
              { id: CONTENT_STATUS.DRAFT, label: 'Draft' },
              { id: CONTENT_STATUS.IN_REVIEW, label: 'In Review' },
              { id: CONTENT_STATUS.CHANGES_REQUESTED, label: 'Changes Requested' },
              { id: CONTENT_STATUS.REVIEWER_APPROVED, label: 'Reviewer Approved' },
              { id: CONTENT_STATUS.APPROVED, label: 'Approved' },
              { id: CONTENT_STATUS.REJECTED, label: 'Rejected' },
            ].map((f) => {
              const active = statusFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-brand-teal ${
                    active
                      ? 'bg-brand-navy text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => dispatch(fetchContentList(statusFilter === 'ALL' ? undefined : statusFilter))}
          />
        )}

        {/* Loading State */}
        {loading && <Loading message="Loading drafts..." rows={4} />}

        {/* Empty State */}
        {!loading && filteredList.length === 0 && (
          <EmptyState
            title="No drafts match your filter"
            description={
              statusFilter !== 'ALL'
                ? `There are currently no items in '${statusFilter}' status.`
                : 'No marketing content drafts have been created yet.'
            }
            action={
              canCreateContent ? (
                <Link
                  to="/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-teal text-white text-xs font-semibold shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  Create First Draft
                </Link>
              ) : null
            }
          />
        )}

        {/* Content Table */}
        {!loading && filteredList.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Title / Document</th>
                  <th className="px-5 py-3.5">Channel</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Version</th>
                  <th className="px-5 py-3.5">Creator</th>
                  <th className="px-5 py-3.5">Last Updated</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredList.map((content) => {
                  const ChannelIcon = channelIcons[content.channel] || FileText;
                  return (
                    <tr
                      key={content.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/content/${content.id}`)}
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 group-hover:text-brand-teal transition-colors">
                          {content.title}
                        </div>
                        <div className="text-[11px] text-slate-600 font-mono">ID: {content.id}</div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                          <ChannelIcon className="w-3.5 h-3.5 text-brand-teal" />
                          {content.channel}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={content.status} />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap font-mono text-slate-700 font-semibold">
                        v{content.currentVersion}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                        {content.createdByName}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-slate-500 font-mono">
                        {formatDate(content.updatedAt)}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <Link
                          to={`/content/${content.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-teal hover:bg-brand-light transition"
                        >
                          Review
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
