import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function Insights() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-brand-navy">Governance Insights</h1>
          <p className="text-xs text-slate-500">Summary counts and dispute breakdown (Phase 6)</p>
        </div>
      </div>
    </div>
  );
}
