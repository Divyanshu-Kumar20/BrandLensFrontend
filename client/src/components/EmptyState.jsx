import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'No items found',
  description = 'There are no records matching your criteria.',
  icon: Icon = Inbox,
  action = null,
}) {
  return (
    <div
      role="status"
      className="p-8 sm:p-12 text-center rounded-xl border border-dashed border-slate-300 bg-white space-y-3"
    >
      <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
        <Icon className="w-6 h-6" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
