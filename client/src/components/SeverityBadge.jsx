import React from 'react';
import { AlertOctagon, AlertTriangle, Info } from 'lucide-react';
import { SEVERITIES } from '../utils/constants';

export default function SeverityBadge({ severity, size = 'sm' }) {
  const isSmall = size === 'sm';

  switch (severity) {
    case SEVERITIES.BLOCKING:
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full bg-rose-50 text-rose-700 border border-rose-300 ${
            isSmall ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
          }`}
          aria-label="Severity: Blocking"
        >
          <AlertOctagon className={isSmall ? 'w-3 h-3 text-rose-600' : 'w-3.5 h-3.5 text-rose-600'} aria-hidden="true" />
          <span>Blocking</span>
        </span>
      );
    case SEVERITIES.SHOULD_FIX:
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full bg-amber-50 text-amber-800 border border-amber-300 ${
            isSmall ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
          }`}
          aria-label="Severity: Should Fix"
        >
          <AlertTriangle className={isSmall ? 'w-3 h-3 text-amber-600' : 'w-3.5 h-3.5 text-amber-600'} aria-hidden="true" />
          <span>Should Fix</span>
        </span>
      );
    case SEVERITIES.SUGGESTION:
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full bg-blue-50 text-blue-700 border border-blue-300 ${
            isSmall ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
          }`}
          aria-label="Severity: Suggestion"
        >
          <Info className={isSmall ? 'w-3 h-3 text-blue-600' : 'w-3.5 h-3.5 text-blue-600'} aria-hidden="true" />
          <span>Suggestion</span>
        </span>
      );
  }
}
