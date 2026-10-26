import React from 'react';
import { PenTool } from 'lucide-react';

export default function NewContent() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-teal-50 text-teal-600">
          <PenTool className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-brand-navy">New Marketing Draft</h1>
          <p className="text-xs text-slate-500">Draft editor and verification trigger (Phase 3)</p>
        </div>
      </div>
    </div>
  );
}
