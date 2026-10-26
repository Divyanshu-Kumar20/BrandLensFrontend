import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldCheck, UserCheck, ShieldAlert, Sparkles, Mail, Lock, ArrowRight, AlertCircle, Info } from 'lucide-react';
import { loginWithDemo, loginWithCredentials, clearAuthError } from '../store/authSlice';
import { ROLES } from '../utils/constants';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedDemoRole, setSelectedDemoRole] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const redirectPath = location.state?.from?.pathname || '/';

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleDemoLogin = async (role) => {
    setSelectedDemoRole(role);
    const result = await dispatch(loginWithDemo(role));
    if (result.type === 'auth/loginWithDemo/fulfilled') {
      navigate(redirectPath, { replace: true });
    }
  };

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    const result = await dispatch(loginWithCredentials({ email, password }));
    if (result.type === 'auth/loginWithCredentials/fulfilled') {
      navigate(redirectPath, { replace: true });
    }
  };

  const demoRoles = [
    {
      role: ROLES.CREATOR,
      label: 'Continue as Creator',
      desc: 'Submit drafts, review findings, accept or dispute fixes',
      badge: 'Asha (Creator)',
      bg: 'hover:border-teal-500 hover:bg-teal-50/40',
    },
    {
      role: ROLES.REVIEWER,
      label: 'Continue as Reviewer',
      desc: 'First review stage: inspect claims, approve or request changes',
      badge: 'Rohan (Reviewer)',
      bg: 'hover:border-blue-500 hover:bg-blue-50/40',
    },
    {
      role: ROLES.MANAGER,
      label: 'Continue as Manager',
      desc: 'Final publication sign-off and team governance',
      badge: 'Maya (Manager)',
      bg: 'hover:border-purple-500 hover:bg-purple-50/40',
    },
    {
      role: ROLES.ADMIN,
      label: 'Continue as Admin',
      desc: 'Manage brand guidelines, facts, and terminology',
      badge: 'Dev (Admin)',
      bg: 'hover:border-amber-500 hover:bg-amber-50/40',
    },
  ];

  return (
    <div className="max-w-xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-8">
        {/* Header / Product Intro */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-teal text-white shadow-md mb-2">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
            BrandLens
          </h1>
          <p className="text-sm font-medium text-slate-600">
            Pre-publication brand-governance web app
          </p>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Ensuring every marketing asset complies with company guidelines, verified facts, and legal terminology before it goes live.
          </p>
        </div>

        {/* First-time Judge helper */}
        <div className="bg-brand-light/60 border border-brand-teal/20 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-700">
          <Info className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-brand-navy font-semibold">Hackathon Judge Quick-Start:</strong>
            <span className="ml-1 text-slate-600">
              Click any of the four demo buttons below to instantly enter the app with pre-seeded permissions for Nimbus Coffee Co.
            </span>
          </div>
        </div>

        {/* Global Error Alert */}
        {error && (
          <div
            role="alert"
            className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-800"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Four Demo Role Buttons */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Demo Access (Recommended)
            </span>
            <span className="text-[11px] font-mono text-slate-600">POST /auth/demo</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {demoRoles.map((item) => (
              <button
                key={item.role}
                type="button"
                id={`demo-btn-${item.role}`}
                disabled={loading}
                onClick={() => handleDemoLogin(item.role)}
                className={`p-3.5 text-left rounded-xl border border-slate-200 transition-all duration-150 flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-brand-teal ${item.bg} ${
                  loading && selectedDemoRole === item.role ? 'bg-slate-50 border-brand-teal ring-2 ring-brand-teal' : 'bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-brand-teal transition-colors">
                      {item.label}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-teal group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
                  <span className="font-mono">{item.badge}</span>
                  <span className="uppercase text-[9px] font-semibold text-brand-teal">Demo</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-600 font-semibold">Or sign in with email</span>
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@nimbus.demo"
                className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal bg-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal bg-white"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-600">
              Demo passwords accept any value for seeded emails (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded">creator@nimbus.demo</code>)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-teal flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* AI-use Disclosure */}
        <div className="pt-4 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-600 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
              <span>AI-Use Disclosure</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600">
              BrandLens processes submitted marketing draft text through deterministic brand rules and Google Gemini AI via our secure backend. No drafts are sent to external services without explicit user toggle confirmation on the submission screen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
