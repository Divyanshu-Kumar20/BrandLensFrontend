import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({
  message = 'An error occurred while communicating with the server.',
  code = null,
  onRetry = null,
}) {
  return (
    <div
      role="alert"
      className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
    >
      <div className="flex items-center gap-2.5">
        <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" aria-hidden="true" />
        <div>
          <div className="font-semibold text-rose-900">{message}</div>
          {code && <div className="text-[10px] text-rose-700 font-mono mt-0.5">Code: {code}</div>}
        </div>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold transition focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs flex-shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      )}
    </div>
  );
}
