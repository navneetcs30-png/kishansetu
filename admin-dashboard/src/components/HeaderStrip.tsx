import React from 'react';
import { 
  ShieldCheck, 
  Users, 
  Clock, 
  ShoppingBag, 
  AlertTriangle, 
  RefreshCw, 
  DownloadCloud, 
  CheckCircle2, 
  Info,
  Layers,
  KeyRound
} from 'lucide-react';
import { DashboardMetrics } from '../types';

interface HeaderStripProps {
  metrics: DashboardMetrics;
  onRefresh: () => void;
  onExportAudit: () => void;
  onOpenCredentialsModal?: () => void;
  isRefreshing: boolean;
  sampleDataCount: number;
}

export const HeaderStrip: React.FC<HeaderStripProps> = ({
  metrics,
  onRefresh,
  onExportAudit,
  onOpenCredentialsModal,
  isRefreshing,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-40">
      {/* Top Operations Meta Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-bold text-slate-100 text-sm tracking-tight">
              <div className="w-7 h-7 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>KishanSetu</span>
              <span className="text-slate-500 font-normal">/</span>
              <span className="text-purple-300 font-bold">Super Admin Master Console</span>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-950/80 text-purple-300 border border-purple-800/80">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              ⚡ Super Admin Clearance • Level 5 Authority
            </span>
          </div>

          {/* Right Action Utilities & Sample Badge */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/40 text-amber-300/90 border border-amber-800/50 text-[11px]">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-medium">Illustrative Sample Data</span>
              <span className="text-amber-500/80 hidden md:inline">• Safe Sandbox</span>
            </div>

            <button
              id="header-export-audit-btn"
              onClick={onExportAudit}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 text-[11px]"
              title="Download sanitized administrative audit summary"
            >
              <DownloadCloud className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Export Audit Log</span>
            </button>

            <button
              id="header-refresh-btn"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 text-[11px] disabled:opacity-60"
              title="Refresh queue feeds"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Feeds</span>
            </button>

            {onOpenCredentialsModal && (
              <button
                id="header-credentials-btn"
                onClick={onOpenCredentialsModal}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 text-[11px] cursor-pointer"
                title="Manage Admin database credentials & master password"
              >
                <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">DB Credentials</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Running Metric Summary Strip */}
      <div className="bg-slate-900/60 border-t border-slate-800/80 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          {/* Total Users */}
          <div 
            id="metric-total-users"
            className="flex items-center gap-3 p-2 rounded-lg bg-slate-950/60 border border-slate-800/90 hover:border-slate-700/80 transition-colors"
          >
            <div className="w-9 h-9 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider truncate">
                Total Users
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-slate-100 font-mono">
                  {metrics.totalUsers.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">
                  +18 today
                </span>
              </div>
            </div>
          </div>

          {/* Pending Verifications */}
          <div 
            id="metric-pending-verifications"
            className="flex items-center gap-3 p-2 rounded-lg bg-amber-950/20 border border-amber-700/40 hover:border-amber-600/60 transition-colors"
          >
            <div className="w-9 h-9 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-amber-300 uppercase tracking-wider truncate">
                Pending Review
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-amber-200 font-mono">
                  {metrics.pendingVerifications}
                </span>
                <span className="text-[10px] text-amber-400/90 font-medium">
                  Needs Sign-off
                </span>
              </div>
            </div>
          </div>

          {/* Active Listings */}
          <div 
            id="metric-active-listings"
            className="flex items-center gap-3 p-2 rounded-lg bg-slate-950/60 border border-slate-800/90 hover:border-slate-700/80 transition-colors"
          >
            <div className="w-9 h-9 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider truncate">
                Active Listings
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-slate-100 font-mono">
                  {metrics.activeListings.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">
                  Across 42 crops
                </span>
              </div>
            </div>
          </div>

          {/* Role Distribution & Gateways */}
          <div 
            id="metric-roles-breakdown"
            className="flex items-center gap-3 p-2 rounded-lg bg-slate-950/60 border border-slate-800/90 hover:border-slate-700/80 transition-colors"
          >
            <div className="w-9 h-9 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider truncate">
                Active Participants
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300 mt-0.5">
                <span className="text-emerald-400" title="Active Farmers">
                  🌾 {metrics.activeFarmers}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-blue-400" title="Active Bulk Buyers">
                  🏢 {metrics.activeBulkBuyers}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-400" title="Active Consumers">
                  🛒 {metrics.activeConsumers}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
