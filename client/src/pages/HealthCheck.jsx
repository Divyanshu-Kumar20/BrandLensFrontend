import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, CheckCircle2, AlertCircle, RefreshCw, Server, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { api, isMockMode } from '../api';

export default function HealthCheck() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const mockMode = isMockMode();

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getHealth();
      setData(result);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.message || 'Failed to connect to /health endpoint');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro hero card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-light text-brand-teal mb-3">
              <ShieldCheck className="w-4 h-4" />
              Codex 48 &bull; Round 2 Build
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
              BrandLens Client Foundation
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Pre-publication brand-governance system. Verifying connectivity to API contracts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchHealth}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-brand-teal"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Re-check /health
            </button>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-brand-navy hover:bg-brand-navy-light text-white transition focus:outline-none focus:ring-2 focus:ring-brand-teal"
            >
              Go to Demo Login
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Primary Health Status Banner */}
        <div className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Service Connectivity Status
          </h2>

          <div
            id="health-status-container"
            className={`p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              loading
                ? 'bg-slate-50 border-slate-200'
                : mockMode
                ? 'bg-emerald-50/70 border-emerald-200'
                : data && data.status === 'ok'
                ? 'bg-teal-50/70 border-teal-200'
                : 'bg-rose-50 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  loading
                    ? 'bg-slate-200 text-slate-500'
                    : mockMode
                    ? 'bg-emerald-100 text-emerald-700'
                    : data && data.status === 'ok'
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {loading ? (
                  <Activity className="w-5 h-5 animate-spin" />
                ) : mockMode || (data && data.status === 'ok') ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <AlertCircle className="w-6 h-6" />
                )}
              </div>

              <div>
                <div className="text-lg font-bold">
                  {loading ? (
                    <span className="text-slate-600">Checking endpoint...</span>
                  ) : mockMode ? (
                    <span id="health-mode-text" className="text-emerald-900 font-extrabold flex items-center gap-2">
                      Mock mode
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                        Section 4 compliant
                      </span>
                    </span>
                  ) : data && data.status === 'ok' ? (
                    <span id="health-mode-text" className="text-teal-900 font-extrabold flex items-center gap-2">
                      API connected
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-teal-200 text-teal-800">
                        Live Express Backend
                      </span>
                    </span>
                  ) : (
                    <span className="text-rose-900 font-bold">API Connection Failed</span>
                  )}
                </div>

                <div className="text-xs text-slate-600 mt-0.5">
                  {loading
                    ? 'Calling GET /health...'
                    : mockMode
                    ? 'Using in-memory realistic seed mock layer (Nimbus Coffee Co.)'
                    : error
                    ? error
                    : `Database: ${data?.db || 'connected'}`}
                </div>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500 self-end sm:self-center font-mono">
              {lastChecked && <span>Last checked: {lastChecked}</span>}
            </div>
          </div>
        </div>

        {/* Payload / Diagnostics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-xs">
            <div className="text-slate-500 font-semibold mb-2 flex items-center gap-2">
              <Server className="w-4 h-4 text-brand-teal" />
              Response Data (GET /health)
            </div>
            <pre className="bg-white p-3 rounded border border-slate-200 text-slate-800 overflow-x-auto">
              {JSON.stringify(data || { status: 'pending' }, null, 2)}
            </pre>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-2.5">
            <div className="text-slate-500 font-semibold mb-2 flex items-center gap-2 font-mono">
              <Zap className="w-4 h-4 text-brand-teal" />
              Environment Variables
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span className="font-mono text-slate-600">VITE_API_URL:</span>
              <span className="font-mono font-medium text-slate-800">
                {import.meta.env.VITE_API_URL || '(default: http://localhost:5000/api)'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span className="font-mono text-slate-600">VITE_USE_MOCK:</span>
              <span
                className={`font-mono font-bold px-1.5 py-0.5 rounded ${
                  mockMode ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'
                }`}
              >
                {String(import.meta.env.VITE_USE_MOCK)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-mono text-slate-600">Base Path:</span>
              <span className="font-mono font-medium text-slate-800">/api</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
