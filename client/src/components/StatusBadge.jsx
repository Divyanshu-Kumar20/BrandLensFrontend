import React from 'react';
import { CONTENT_STATUS } from '../utils/constants';

const statusConfig = {
  [CONTENT_STATUS.DRAFT]: {
    label: 'Draft',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
    dot: 'bg-slate-400',
  },
  [CONTENT_STATUS.IN_REVIEW]: {
    label: 'In Review',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500 animate-pulse',
  },
  [CONTENT_STATUS.CHANGES_REQUESTED]: {
    label: 'Changes Requested',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-300',
    dot: 'bg-amber-500',
  },
  [CONTENT_STATUS.REVIEWER_APPROVED]: {
    label: 'Reviewer Approved',
    bg: 'bg-teal-50',
    text: 'text-teal-800',
    border: 'border-teal-300',
    dot: 'bg-teal-500',
  },
  [CONTENT_STATUS.APPROVED]: {
    label: 'Approved',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-300',
    dot: 'bg-emerald-500',
  },
  [CONTENT_STATUS.REJECTED]: {
    label: 'Rejected',
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-300',
    dot: 'bg-rose-500',
  },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const config = statusConfig[status] || {
    label: status || 'Unknown',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  };

  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${
        isSmall ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
      aria-label={`Status: ${config.label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
}
