import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Database, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  Sprout, 
  ChevronLeft 
} from 'lucide-react';

export interface AdminLoginGateProps {
  onSuccess: (adminUser: any, token: string) => void;
  onCancel?: () => void;
  currentUser?: any;
}

export function AdminLoginGate({ onSuccess, onCancel, currentUser }: AdminLoginGateProps) {
  const [userId, setUserId] = useState('admin');
  const [password, setPassword] = useState('Admin@KishanSetu2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<{
    status?: string;
    dbPath?: string;
    totalUsers?: number;
    adminConfigured?: boolean;
    adminUsername?: string;
  } | null>(null);

  // Fetch real-time database status on mount
  useEffect(() => {
    fetch('/api/admin/db-status')
      .then((r) => r.json())
      .then((data) => setDbStatus(data))
      .catch((err) => console.warn('Could not fetch DB stats:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Authentication failed. Please verify your Admin User ID and Password.');
        setIsLoading(false);
        return;
      }

      // Store in localStorage
      localStorage.setItem('kishansetu_admin_token', data.token);
      localStorage.setItem('kishansetu_admin_user', JSON.stringify(data.user));

      onSuccess(data.user, data.token);
    } catch (err: any) {
      setErrorMessage('Network error connecting to authentication server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = () => {
    setUserId('admin');
    setPassword('Admin@KishanSetu2026');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative z-10">
        {/* Top Restricted Badge */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800 text-purple-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Root Clearance (Level 5)</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono">
            <Database className="w-3 h-3 text-emerald-400" />
            <span>DB: {dbStatus?.status === 'ONLINE' ? 'Connected' : 'Syncing'}</span>
          </div>
        </div>

        {/* Header Title */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-lg mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Admin Authentication
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            Only authorized administrators can access the Master Control Tower, audit trails, and national market controls.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/90 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Access Denied</p>
              <p className="text-rose-300 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Database Seeded Credentials Quick-Fill Card */}
        <div className="mb-6 p-3.5 rounded-2xl bg-slate-800/80 border border-purple-500/30 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Database Admin Credentials
            </span>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
            >
              Auto-Fill Credentials
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-sans">User ID</span>
              <span className="font-semibold text-white">admin</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-sans">Password</span>
              <span className="font-semibold text-white">Admin@KishanSetu2026</span>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-slate-400">
            Stored with salted cryptographic hash in <code className="text-slate-300">data/database.json</code>
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Admin User ID or Email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter admin or admin@kishansetu.in"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter master password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm pr-10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Verifying Database Credentials...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Authorize & Unlock Admin Console</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Back button */}
        {onCancel && (
          <div className="mt-5 pt-4 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Return to Public Marketplace & Dashboards</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
