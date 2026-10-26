import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NotAllowed from '../pages/NotAllowed';

export default function RoleGate({ allowedRoles = [], children, inline = false, fallback = null }) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const userRole = user?.role;
  const isAuthorized = allowedRoles.length === 0 || (userRole && allowedRoles.includes(userRole));

  if (!isAuthorized) {
    if (inline) {
      return (
        fallback || (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-center justify-between">
            <span>Only users with role: <strong>{allowedRoles.join(', ')}</strong> can access this action.</span>
            <span className="font-mono text-[11px] bg-amber-100 px-2 py-0.5 rounded">Your role: {userRole || 'none'}</span>
          </div>
        )
      );
    }
    return (
      <Navigate
        to="/not-allowed"
        state={{
          requiredRoles: allowedRoles,
          currentRole: userRole,
          attemptedPath: location.pathname,
        }}
        replace
      />
    );
  }

  return children;
}
