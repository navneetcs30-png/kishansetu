import React from 'react';
import { 
  Users, 
  Clock, 
  ShoppingBag, 
  AlertTriangle, 
  RefreshCw, 
  DownloadCloud, 
  KeyRound
} from 'lucide-react';
import { DashboardMetrics } from '../types';
import { useLanguage } from '../../../src/i18n/LanguageContext';

interface HeaderStripProps {
  metrics: DashboardMetrics;
  onRefresh: () => void;
  onExportAudit: () => void;
  onOpenCredentialsModal?: () => void;
  isRefreshing: boolean;
  sampleDataCount?: number;
}

export const HeaderStrip: React.FC<HeaderStripProps> = ({
  metrics,
  onRefresh,
  onExportAudit,
  onOpenCredentialsModal,
  isRefreshing,
}) => {
  const { t } = useLanguage();

  return (
    <div className="border-b border-slate-800 bg-slate-950/95 transition-colors duration-200">
      {/* Top Operations Action Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
              <h2 className="font-bold text-slate-100 text-sm tracking-tight">
                {t('admin.toolbarTitle', 'Super Admin Operations Center')}
              </h2>
            </div>

            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-950/80 text-purple-300 border border-purple-800/80">
              ⚡ Level 5 SOC Clearance
            </span>
          </div>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              id="header-export-audit-btn"
              onClick={onExportAudit}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer text-xs"
              title="Download sanitized administrative audit summary"
            >
              <DownloadCloud className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">{t('admin.exportAudit', 'Export Audit Log')}</span>
            </button>

            <button
              id="header-refresh-btn"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer text-xs disabled:opacity-60"
              title="Refresh queue feeds"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{t('admin.syncFeeds', 'Sync Feeds')}</span>
            </button>

            {onOpenCredentialsModal && (
              <button
                id="header-credentials-btn"
                onClick={onOpenCredentialsModal}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-800/80 transition-colors cursor-pointer text-xs"
                title="Manage Admin database credentials & master password"
              >
                <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">{t('admin.dbCredentials', 'DB Credentials')}</span>
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
            className="flex items-center gap-3 p-2 rounded-lg bg-slate-950/60 border border-slate-800/90"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider leading-none">
                {t('admin.totalUsers', 'Total Users')}
              </p>
              <p className="text-base font-black text-slate-100 font-mono mt-0.5">
                {metrics.totalUsers.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Pending Verifications */}
          <div 
            id="metric-pending-verifications"
            className="flex items-center gap-3 p-2 rounded-lg bg-slate-950/60 border border-slate-800/90"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider leading-none">
                {t('admin.pendingQueue', 'Pending Queue')}
              </p>
              <p className="text-base font-black text-amber-400 font-mono mt-0.5">
                {metrics.pendingVerifications}
              </p>
            </div>
          </div>

          {/* Active Listings */}
          <div 
            id="metric-active-listings"
            className="flex items-center gap-3 p-2 rounded-lg bg-slate-950/60 border border-slate-800/90"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider leading-none">
                Mandi Listings
              </p>
              <p className="text-base font-black text-emerald-400 font-mono mt-0.5">
                {metrics.activeListings}
              </p>
            </div>
          </div>

          {/* SLA Compliance */}
          <div 
            id="metric-sla-compliance"
            className="flex items-center gap-3 p-2 rounded-lg bg-slate-950/60 border border-slate-800/90"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider leading-none">
                Enforcement SLA
              </p>
              <p className="text-base font-black text-purple-300 font-mono mt-0.5">
                {metrics.slaBreaches === 0 ? '100% Compliant' : `${metrics.slaBreaches} Breaches`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
