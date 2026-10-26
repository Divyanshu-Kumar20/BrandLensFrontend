import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading({ message = 'Loading brand knowledge...', rows = 3 }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="p-8 text-center bg-white rounded-xl border border-slate-200 space-y-4"
    >
      <div className="flex items-center justify-center gap-2 text-brand-teal">
        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
        <span className="text-xs font-semibold text-slate-700">{message}</span>
      </div>

      <div className="space-y-2 max-w-xl mx-auto pt-2 animate-pulse" aria-hidden="true">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-9 bg-slate-100 rounded-lg w-full" />
        ))}
      </div>
    </div>
  );
}
