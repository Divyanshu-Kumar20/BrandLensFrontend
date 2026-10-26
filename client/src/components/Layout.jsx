import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShieldCheck, Database, Wifi, Layers, LogOut, ExternalLink, Sparkles } from 'lucide-react';
import { api, isMockMode } from '../api';
import { logout } from '../store/authSlice';

export default function Layout({ children }) {
  const [health, setHealth] = useState({ loading: true, status: null, db: null, error: null });
  const { user, org, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const mockEnabled = isMockMode();

  useEffect(() => {
    let isMounted = true;
    async function checkHealth() {
      try {
        const res = await api.getHealth();
        if (isMounted) {
          setHealth({ loading: false, status: res.status, db: res.db, error: null });
        }
      } catch (err) {
        if (isMounted) {
          setHealth({ loading: false, status: 'error', db: null, error: err.message || 'Cannot reach API' });
        }
      }
    }
    checkHealth();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/knowledge', label: 'Knowledge Base' },
    { to: '/new', label: 'New Draft' },
    { to: '/insights', label: 'Insights' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Banner / Navigation */}
      <header className="bg-brand-navy text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-2 group focus:outline-none focus:ring-2 focus:ring-brand-teal-light rounded-md p-1">
                <div className="w-9 h-9 rounded-lg bg-brand-teal flex items-center justify-center text-white shadow-inner">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                    BrandLens
                    <span className="text-xs bg-brand-navy-light text-brand-teal-light px-2 py-0.5 rounded font-mono font-normal">v2</span>
                  </span>
                  <span className="hidden sm:block text-xs text-slate-300">Pre-publication Brand Governance</span>
                </div>
              </Link>

              {/* Status Badge */}
              <div className="ml-4 pl-4 border-l border-slate-700 flex items-center space-x-2 text-xs">
                {health.loading ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300 animate-pulse">
                    Connecting...
                  </span>
                ) : mockEnabled ? (
                  <span
                    id="api-status-badge"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700"
                    title="Running with realistic in-memory API data"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Mock mode
                  </span>
                ) : health.status === 'ok' ? (
                  <span
                    id="api-status-badge"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-950 text-teal-300 border border-teal-700"
                    title={`Backend connected (${health.db})`}
                  >
                    <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                    API connected
                  </span>
                ) : (
                  <span
                    id="api-status-badge"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-700"
                    title={health.error}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    API Disconnected
                  </span>
                )}
              </div>
            </div>

            {/* Nav & Role Status */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <nav className="hidden md:flex space-x-1" aria-label="Main Navigation">
                  {navLinks.map((link) => {
                    const active = location.pathname === link.to;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          active
                            ? 'bg-brand-navy-light text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              )}

              {/* User Profile or Login */}
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3 border-l border-slate-700 pl-4">
                  <div className="text-right">
                    <div className="text-xs font-medium text-white">{user.name}</div>
                    <div className="text-[11px] text-brand-teal-light capitalize font-mono">
                      {user.role} &bull; {org?.name || 'Nimbus'}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                    title="Log out"
                    aria-label="Log out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold bg-brand-teal hover:bg-brand-teal-dark text-white transition-colors"
                >
                  Demo Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-2">
            <span>Codex 48 &bull; Team D&A CODERS</span>
            <span>&bull;</span>
            <span className="font-semibold text-brand-navy">BrandLens</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
              Assisted by Antigravity &amp; Gemini
            </span>
            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
              {mockEnabled ? 'VITE_USE_MOCK=true' : 'VITE_USE_MOCK=false'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
