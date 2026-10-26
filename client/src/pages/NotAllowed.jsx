import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShieldAlert, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { loginWithDemo } from '../store/authSlice';
import { ROLES } from '../utils/constants';

export default function NotAllowed() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const stateData = location.state || {};
  const requiredRoles = stateData.requiredRoles || ['admin'];
  const currentRole = stateData.currentRole || user?.role || 'unassigned';

  const handleSwitchRole = async (targetRole) => {
    const result = await dispatch(loginWithDemo(targetRole));
    if (result.type === 'auth/loginWithDemo/fulfilled') {
      if (stateData.attemptedPath) {
        navigate(stateData.attemptedPath, { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto my-12 px-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-8 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-sm mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Role Permission Required
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            This area requires special governance permissions under the BrandLens role hierarchy.
          </p>
        </div>

        {/* Role Comparison */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs uppercase font-bold text-slate-600 tracking-wider">Your Current Role</span>
              <div className="mt-1 text-base font-extrabold text-brand-navy capitalize font-mono">
                {currentRole}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
              <span className="text-xs uppercase font-bold text-teal-700 tracking-wider">Required Role</span>
              <div className="mt-1 text-base font-extrabold text-brand-teal capitalize font-mono">
                {requiredRoles.join(' or ')}
              </div>
            </div>
          </div>

          {/* Quick Demo Switcher for Judges */}
          <div className="pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center justify-between">
              <span>Quick Role Switch (Demo Mode)</span>
              <span className="text-[11px] font-normal text-slate-600 font-sans">Instant 1-click test</span>
            </h2>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Object.values(ROLES).map((roleKey) => {
                const isActive = user?.role === roleKey;
                const isRequired = requiredRoles.includes(roleKey);

                return (
                  <button
                    key={roleKey}
                    type="button"
                    disabled={loading || isActive}
                    onClick={() => handleSwitchRole(roleKey)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition flex flex-col items-center justify-center gap-1 ${
                      isActive
                        ? 'bg-slate-100 border-slate-300 text-slate-600 cursor-default'
                        : isRequired
                        ? 'bg-brand-teal text-white border-brand-teal hover:bg-brand-teal-dark shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="capitalize">{roleKey}</span>
                    {isActive ? (
                      <span className="text-[10px] text-slate-600 font-normal">(Active)</span>
                    ) : isRequired ? (
                      <span className="text-[10px] text-teal-100 font-normal flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Allowed
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-brand-navy transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Safety
            </Link>

            <Link
              to="/login"
              className="text-xs font-semibold text-brand-teal hover:underline"
            >
              Log in with different account &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
