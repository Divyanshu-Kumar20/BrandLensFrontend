import React, { useState } from 'react';
import { Sparkles, ShieldCheck, ChevronDown, ChevronUp, Lock, CheckCircle2, Info } from 'lucide-react';

export default function AiDisclosureBanner({ compact = false, className = '' }) {
  const [expanded, setExpanded] = useState(!compact);

  return (
    <div
      role="region"
      aria-label="AI Transparency & Security Disclosure"
      className={`bg-gradient-to-r from-purple-50 via-indigo-50 to-teal-50 border border-purple-200/80 rounded-2xl p-4 shadow-xs transition-all ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-inner">
            <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-brand-navy tracking-tight">
                AI Transparency &amp; Governance Disclosure
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-semibold border border-purple-200">
                Powered by Antigravity &bull; Gemini
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              BrandLens combines deterministic rule validation with Gemini AI reasoning to safeguard brand integrity.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="text-xs font-medium text-purple-700 hover:text-purple-900 flex items-center gap-1 flex-shrink-0 p-1.5 rounded-lg hover:bg-purple-100/50 transition focus:outline-none focus:ring-2 focus:ring-brand-teal"
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse AI disclosure' : 'Expand AI disclosure'}
        >
          <span>{expanded ? 'Less info' : 'Details'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3.5 pt-3 border-t border-purple-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 animate-in fade-in duration-200">
          <div className="bg-white/80 p-3 rounded-xl border border-purple-100 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-brand-navy">
              <Lock className="w-3.5 h-3.5 text-brand-teal" />
              <span>Zero-Exposure Security</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              Zero client-side API keys. Requests route through authenticated backend proxies. Draft copy is never used to train external models.
            </p>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-purple-100 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-brand-navy">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Dual-Engine Verification</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              Exact banned terms and numerical facts are enforced by deterministic rules. Tone and claim nuances are reviewed by Gemini with confidence scores.
            </p>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-purple-100 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-brand-navy">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Human-in-the-Loop</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              Non-destructive editing: AI findings are solely recommendations. Draft copy never changes automatically without human creator review.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
