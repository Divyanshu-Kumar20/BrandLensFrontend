import React from 'react';
import { useParams } from 'react-router-dom';
import { FileCheck } from 'lucide-react';

export default function ReviewContent() {
  const { id } = useParams();
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
          <FileCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-brand-navy">Content Review: {id}</h1>
          <p className="text-xs text-slate-500">Highlighted text and findings panel (Phase 4 &amp; 5)</p>
        </div>
      </div>
    </div>
  );
}
