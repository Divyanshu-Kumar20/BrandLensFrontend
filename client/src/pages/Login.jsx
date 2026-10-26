import React from 'react';
import { Link } from 'react-router-dom';

export default function LoginPlaceholder() {
  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
      <h2 className="text-xl font-bold text-brand-navy">Demo Login</h2>
      <p className="text-xs text-slate-500 mt-1 mb-6">Phase 1 is ready to be implemented.</p>
      <Link to="/" className="text-xs text-brand-teal hover:underline">&larr; Back to Health Check</Link>
    </div>
  );
}
