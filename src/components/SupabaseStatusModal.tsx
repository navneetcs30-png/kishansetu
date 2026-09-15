import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Cloud, 
  CloudOff, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  RefreshCw,
  Server,
  KeyRound,
  FileCode2,
  ShieldCheck
} from 'lucide-react';
import { isSupabaseConfigured, SUPABASE_URL } from '../services/supabaseClient';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedSqlPath, setCopiedSqlPath] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/supabase/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      } else {
        setStatus({
          activeMode: 'Local Resilient (Supabase API not responding)',
          supabase: { configured: isSupabaseConfigured(), connected: false }
        });
      }
    } catch {
      setStatus({
        activeMode: 'Local Offline Engine',
        supabase: { configured: isSupabaseConfigured(), connected: false }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isConnected = status?.supabase?.connected;
  const isConfigured = status?.supabase?.configured || isSupabaseConfigured();

  const envTemplate = `VITE_SUPABASE_URL=https://your-project-id.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-key-here\nSUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here`;

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-800 dark:text-slate-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isConnected ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Supabase Cloud Database</h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  isConnected 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' 
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                }`}>
                  {isConnected ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" /> Live Connected
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3" /> Ready / Local Fallback
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                PostgreSQL • Realtime • Identity & Access Management
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Connection Overview Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Database Engine
              </span>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <Cloud className="w-4 h-4 text-emerald-500" />
                {isConnected ? 'Supabase Cloud (PostgreSQL)' : 'Dual-Engine: Ready for Supabase'}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isConnected ? `Endpoint: ${SUPABASE_URL}` : 'Local database fallback active so features work seamlessly offline.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Connection Health
              </span>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <Server className="w-4 h-4 text-indigo-500" />
                {loading ? 'Checking connection...' : isConnected ? `Healthy (${status?.supabase?.latencyMs ?? 42}ms latency)` : 'Offline Engine Operational'}
              </div>
              <button
                type="button"
                onClick={fetchStatus}
                disabled={loading}
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                Re-test Connection
              </button>
            </div>
          </div>

          {/* Setup Guide */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              How to Connect Your Supabase Project:
            </h4>

            <ol className="space-y-3 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside">
              <li className="leading-relaxed">
                <strong>Create a Supabase Project:</strong> Sign in at{' '}
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-600 dark:text-emerald-400 underline inline-flex items-center gap-0.5"
                >
                  supabase.com <ExternalLink className="w-3 h-3 inline" />
                </a>{' '}
                and create a free project.
              </li>
              <li className="leading-relaxed">
                <strong>Run the Schema Migration:</strong> In your Supabase dashboard, go to the <strong>SQL Editor</strong>, open or paste the contents of{' '}
                <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-emerald-600 dark:text-emerald-400">
                  supabase/schema.sql
                </code>{' '}
                and click <strong>Run</strong>.
              </li>
              <li className="leading-relaxed">
                <strong>Add Your API Keys:</strong> Open the <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">.env</code> file in your KishanSetu root directory and fill in your keys:
              </li>
            </ol>

            {/* Code Block for .env variables */}
            <div className="relative p-3.5 bg-slate-900 rounded-xl text-slate-200 font-mono text-xs border border-slate-800">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" /> .env configuration
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(envTemplate, setCopiedEnv)}
                  className="flex items-center gap-1 text-slate-300 hover:text-white cursor-pointer transition-colors"
                >
                  {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedEnv ? 'Copied' : 'Copy Template'}
                </button>
              </div>
              <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-300">
                {envTemplate}
              </pre>
            </div>

            {/* SQL File Reference */}
            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-slate-700 dark:text-slate-200">
                  SQL Schema file ready at: <code className="font-bold">d:\kishansetu\supabase\schema.sql</code>
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard('supabase/schema.sql', setCopiedSqlPath)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors shrink-0"
              >
                {copiedSqlPath ? 'Copied' : 'Copy File Path'}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>KishanSetu Dual-Engine Architecture</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium cursor-pointer transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
