import React from 'react';
import { useSelector } from 'react-redux';
import { BookOpen } from 'lucide-react';
import { ROLES } from '../utils/constants';

export default function Knowledge() {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === ROLES.ADMIN;

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-brand-light text-brand-teal">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-navy">Brand Knowledge Base</h1>
            <p className="text-xs text-slate-500">
              {isAdmin ? 'Admin Mode: Full CRUD permissions enabled' : 'Read-only view for your role (' + user?.role + ')'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
