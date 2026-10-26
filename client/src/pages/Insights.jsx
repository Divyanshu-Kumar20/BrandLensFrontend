import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  FileCheck,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  TrendingUp,
  Percent,
  Tag,
  BookOpen,
  PieChart,
  Shield,
  Layers,
  Info,
} from 'lucide-react';
import { api } from '../api';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import usePageTitle from '../utils/usePageTitle';

export default function Insights() {
  usePageTitle('Insights');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const summary = await api.getInsightsSummary();
      setData(summary);
    } catch (err) {
      setError(err.message || 'Failed to fetch governance insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const typeConfig = {
    tone: { label: 'Tone of Voice', color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
    terminology: { label: 'Terminology & Banned Terms', color: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50' },
    claim: { label: 'Unsubstantiated Claims', color: 'bg-purple-500', text: 'text-purple-700', bg: 'bg-purple-50' },
    fact: { label: 'Factual Accuracy', color: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50' },
    accessibility: { label: 'Accessibility Standards', color: 'bg-teal-500', text: 'text-teal-700', bg: 'bg-teal-50' },
  };

  const statusConfig = {
    open: { label: 'Unresolved / Open', color: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50' },
    accepted: { label: 'Accepted Direct Fixes', color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
    edited: { label: 'Custom Inline Edits', color: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50' },
    disputed: { label: 'Creator Disputed with Reason', color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center shadow-xs">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
                Nimbus Coffee Co. &bull; Executive Governance
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight">
              Brand Governance Insights &amp; Analytics
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Aggregate compliance performance, common rule violations, dispute patterns, and resolution metrics.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchInsights}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* First-time user guide callout */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-900">Understanding Governance Analytics:</span>
            <p className="text-slate-600">
              This executive dashboard tracks compliance trends across all marketing drafts. High dispute frequencies spotlight clauses where marketing teams frequently encounter ambiguity, helping leadership calibrate brand guidelines.
            </p>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchInsights}
        />
      )}

      {/* Loading state */}
      {loading && <Loading message="Loading governance analytics..." rows={4} />}

      {/* Empty State */}
      {!loading && !error && (!data || data.totals?.analyzedCount === 0) && (
        <EmptyState
          title="No governance data yet"
          description="Draft, check, and publish content to generate compliance analytics and dispute metrics."
        />
      )}

      {!loading && data && data.totals?.analyzedCount > 0 && (
        <>
          {/* Key Metric Totals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Analyzed Count */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Drafts Analyzed</span>
                <div className="p-2 rounded-lg bg-teal-50 text-brand-teal">
                  <FileCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-brand-navy tracking-tight">
                {data.totals?.analyzedCount ?? 0}
              </div>
              <p className="text-[11px] text-slate-500">Total marketing drafts run through review engine</p>
            </div>

            {/* Findings Count */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Total Findings</span>
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-brand-navy tracking-tight">
                {data.totals?.findingsCount ?? 0}
              </div>
              <p className="text-[11px] text-slate-500">Rule &amp; AI-flagged brand violations across drafts</p>
            </div>

            {/* Approved Count */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Approved for Publish</span>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-brand-navy tracking-tight">
                {data.totals?.approvedCount ?? 0}
              </div>
              <p className="text-[11px] text-slate-500">Successfully cleared all governance gates</p>
            </div>

            {/* Rejection Rate */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Rejection Rate</span>
                <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                  <Percent className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-brand-navy tracking-tight">
                {typeof data.totals?.rejectionRate === 'number'
                  ? `${(data.totals.rejectionRate * 100).toFixed(1)}%`
                  : '0%'}
              </div>
              <p className="text-[11px] text-slate-500">Submissions rejected during reviewer or manager stages</p>
            </div>
          </div>

          {/* Breakdown Section: By Type and By Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Findings by Type */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-brand-teal" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Findings by Violation Category
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Total: {data.totals?.findingsCount}</span>
              </div>

              <div className="space-y-3.5">
                {data.byType &&
                  Object.entries(data.byType).map(([typeKey, count]) => {
                    const cfg = typeConfig[typeKey] || {
                      label: typeKey,
                      color: 'bg-slate-500',
                      text: 'text-slate-700',
                      bg: 'bg-slate-50',
                    };
                    const total = data.totals?.findingsCount || 1;
                    const percent = Math.round((count / total) * 100);

                    return (
                      <div key={typeKey} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800">{cfg.label}</span>
                          <span className="font-mono text-slate-600">
                            {count} ({percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${cfg.color} transition-all duration-500`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Findings by Resolution Status */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-teal" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Resolution Status Breakdown
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Action Distribution</span>
              </div>

              <div className="space-y-3.5">
                {data.byStatus &&
                  Object.entries(data.byStatus).map(([statusKey, count]) => {
                    const cfg = statusConfig[statusKey] || {
                      label: statusKey,
                      color: 'bg-slate-500',
                      text: 'text-slate-700',
                      bg: 'bg-slate-50',
                    };
                    const total = data.totals?.findingsCount || 1;
                    const percent = Math.round((count / total) * 100);

                    return (
                      <div key={statusKey} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800">{cfg.label}</span>
                          <span className="font-mono text-slate-600">
                            {count} ({percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${cfg.color} transition-all duration-500`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Top Disputed Clauses Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-teal" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Most Disputed Brand Clauses
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Feedback for Policy Refinement</span>
            </div>

            <p className="text-xs text-slate-500">
              Clauses with high dispute counts indicate guidelines where creators frequently submit justifications, pointing to opportunities for policy clarification.
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5">Clause Code</th>
                    <th className="px-5 py-3.5">Policy / Clause Title</th>
                    <th className="px-5 py-3.5">Dispute Count</th>
                    <th className="px-5 py-3.5">Impact Meter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {data.topDisputedClauses?.map((item) => {
                    const maxCount = Math.max(...(data.topDisputedClauses.map((c) => c.count) || [1]));
                    const barWidth = Math.round((item.count / maxCount) * 100);

                    return (
                      <tr key={item.code} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded bg-slate-100 font-mono font-bold text-brand-navy border border-slate-200">
                            {item.code}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-900">
                          {item.title}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap font-mono font-bold text-amber-700">
                          {item.count} disputes
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap w-48">
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-amber-500"
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
