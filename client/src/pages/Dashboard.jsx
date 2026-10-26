import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { PlusCircle, FileText, CheckCircle2, AlertTriangle, ArrowRight, Clock } from 'lucide-react';
import { ROLES } from '../utils/constants';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
            Brand Governance Dashboard
          </span>
          <h1 className="text-2xl font-bold text-brand-navy mt-1">
            Welcome back, {user?.name || 'User'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Current role: <span className="font-semibold capitalize text-brand-teal font-mono">{user?.role}</span> &bull; Fictional brand: <strong>Nimbus Coffee Co.</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {(user?.role === ROLES.CREATOR || user?.role === ROLES.ADMIN) && (
            <Link
              to="/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-semibold rounded-lg shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4" />
              New Draft
            </Link>
          )}
          <Link
            to="/knowledge"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
          >
            Knowledge Base
          </Link>
        </div>
      </div>

      {/* Role-specific callout / quick test indicator */}
      {(user?.role === ROLES.REVIEWER || user?.role === ROLES.MANAGER) && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-xs font-bold text-blue-900">Waiting for Your Sign-off</div>
              <div className="text-[11px] text-blue-700">
                You have governance review authority for submitted marketing content.
              </div>
            </div>
          </div>
          <Link
            to="/content/c1"
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            View Demo Submission &rarr;
          </Link>
        </div>
      )}

      {/* Quick navigation cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/content/c1"
          className="bg-white border border-slate-200 hover:border-brand-teal rounded-xl p-5 shadow-sm transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Sample Draft</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-800 font-bold">Draft</span>
          </div>
          <h2 className="text-sm font-bold text-brand-navy mt-3 group-hover:text-brand-teal transition-colors">
            Summer Launch Announcement
          </h2>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            Get our CHEAPEST cold brew ever!!! Nimbus is the world&apos;s best coffee...
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-brand-teal font-semibold">
            <span>Open Review Engine</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/knowledge"
          className="bg-white border border-slate-200 hover:border-brand-teal rounded-xl p-5 shadow-sm transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Brand Rules</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-100 text-teal-800 font-bold">8 Clauses</span>
          </div>
          <h2 className="text-sm font-bold text-brand-navy mt-3 group-hover:text-brand-teal transition-colors">
            Knowledge Base
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Guidelines, facts, banned and preferred terms for Nimbus Coffee Co.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-brand-teal font-semibold">
            <span>Explore Rules</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/insights"
          className="bg-white border border-slate-200 hover:border-brand-teal rounded-xl p-5 shadow-sm transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Analytics</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-100 text-purple-800 font-bold">Manager/Admin</span>
          </div>
          <h2 className="text-sm font-bold text-brand-navy mt-3 group-hover:text-brand-teal transition-colors">
            Insights &amp; Summary
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Breakdown of brand violations by type, status, and most disputed clauses.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-brand-teal font-semibold">
            <span>View Summary</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}
