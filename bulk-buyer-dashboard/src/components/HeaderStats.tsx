import React from 'react';
import { 
  IndianRupee, 
  Layers, 
  TrendingDown, 
  FileText, 
  AlertCircle, 
  Building2, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  Scale,
  ShieldCheck,
  UploadCloud,
  BadgeCheck
} from 'lucide-react';
import { formatINR, formatNumber } from '../utils/formatters';
import { OrganizationVerification } from '../types';

interface HeaderStatsProps {
  totalProcurementValue: number;
  totalQuintals: number;
  totalBaseValue: number;
  selectedItemsCount: number;
  activeContractsCount: number;
  actionRequiredCount: number;
  verification: OrganizationVerification;
  onResetQuantities: () => void;
  onOpenOrderModal: () => void;
  onOpenVerificationModal: () => void;
}

export const HeaderStats: React.FC<HeaderStatsProps> = ({
  totalProcurementValue,
  totalQuintals,
  totalBaseValue,
  selectedItemsCount,
  activeContractsCount,
  actionRequiredCount,
  verification,
  onResetQuantities,
  onOpenOrderModal,
  onOpenVerificationModal,
}) => {
  const volumeSavings = Math.max(0, totalBaseValue - totalProcurementValue);
  const metricTonnes = (totalQuintals / 10).toFixed(1);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs transition-colors duration-200" id="dashboard-header">
      {/* Top Utility & Illustrative Disclaimer Bar */}
      <div className="bg-slate-900 dark:bg-slate-950 text-slate-200 dark:text-slate-300 text-xs px-4 py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Illustrative B2B Mandi Benchmarks
            </span>
            <span className="hidden sm:inline text-slate-400">
              Rates subject to lot assaying, moisture index & mandi auction spot settlement.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-slate-300">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium text-white">{verification.companyName}</span>
              <span className="text-slate-400 hidden md:inline">• Lic: {verification.mandiLicenseNo}</span>
            </div>

            <button
              type="button"
              onClick={onOpenVerificationModal}
              id="header-verification-badge-btn"
              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                verification.overallStatus === 'Verified'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900'
                  : 'bg-amber-950 text-amber-300 border border-amber-600/50 hover:bg-amber-900'
              }`}
            >
              {verification.overallStatus === 'Verified' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>GST & License Verified</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                  <span>Upload GST & License to Verify</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Unverified Buyer Urgent Action Callout Banner if documents required */}
      {verification.overallStatus !== 'Verified' && (
        <div className="bg-amber-500/10 dark:bg-amber-950/40 border-b border-amber-300/60 dark:border-amber-700/50 px-4 py-2 text-xs text-amber-950 dark:text-amber-200">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
              <span>
                <strong className="font-bold">Organization Verification Pending: </strong>
                Upload your company GST Certificate and Mandi Trading License to upgrade trading limit to ₹50 Lakhs & waive APMC middleman cess.
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenVerificationModal}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition shadow-2xs self-start sm:self-auto shrink-0"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload GST & License</span>
            </button>
          </div>
        </div>
      )}

      {/* Primary Header Title & Live Running Total Strip */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and Branding */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-emerald-100 flex items-center justify-center font-bold text-lg shadow-sm">
                🌾
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
                Bulk Buyer Procurement Dashboard
              </h1>
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                B2B Wholesale
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Direct farmer & FPO bulk sourcing portal with live volume tiers, contract milestones, and e-NAM compliance.
            </p>
          </div>


          {/* Running Live Total Box - High Contrast Enterprise Metric */}
          <div className="flex flex-wrap items-center gap-3">
            <div 
              id="running-procurement-total-box"
              className="flex-1 sm:flex-initial bg-slate-900 dark:bg-slate-950 text-white rounded-xl p-3 sm:px-5 sm:py-3 shadow-md border border-slate-700 dark:border-slate-800 min-w-[240px] sm:min-w-[280px]"
              role="region"
              aria-label="Running Total Procurement Value"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-0.5">
                <span className="uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                  Total Procurement Value
                </span>
                {selectedItemsCount > 0 && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-medium animate-pulse">
                    Live
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-400 font-display">
                  {formatINR(totalProcurementValue)}
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  {totalQuintals > 0 ? `${formatNumber(totalQuintals)} Q (${metricTonnes} MT)` : '0 Quintals'}
                </span>
              </div>

              {/* Sub metrics & savings */}
              <div className="mt-1 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">
                  {selectedItemsCount} {selectedItemsCount === 1 ? 'commodity' : 'commodities'} selected
                </span>
                {volumeSavings > 0 ? (
                  <span className="text-amber-400 font-medium flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    Save {formatINR(volumeSavings)} (Bulk Tier)
                  </span>
                ) : (
                  <span className="text-slate-500">Tier discounts apply at volume</span>
                )}
              </div>
            </div>

            {/* Quick action buttons next to running total */}
            <div className="flex sm:flex-col gap-2">
              <button
                type="button"
                id="header-order-action-btn"
                disabled={totalProcurementValue === 0}
                onClick={onOpenOrderModal}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold text-xs sm:text-sm shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
              >
                <FileText className="w-4 h-4" />
                Place Order / Quote
              </button>

              {selectedItemsCount > 0 && (
                <button
                  type="button"
                  id="header-reset-quantities-btn"
                  onClick={onResetQuantities}
                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
                  title="Reset all entered quantities to 0"
                >
                  <RotateCcw className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Secondary KPI Bar */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
            <Scale className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <div>
              <div className="text-slate-500 dark:text-slate-400 font-medium">Bulk Unit Standard</div>
              <div className="font-semibold text-slate-800 dark:text-white">1 Quintal = 100 kg (0.1 MT)</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
            <Layers className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
            <div>
              <div className="text-slate-500 dark:text-slate-400 font-medium">Active Contracts</div>
              <div className="font-semibold text-slate-800 dark:text-white">{activeContractsCount} In-Flight Orders</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
            <AlertCircle className={`w-4 h-4 shrink-0 ${actionRequiredCount > 0 ? 'text-amber-600 animate-bounce' : 'text-slate-400'}`} />
            <div>
              <div className="text-slate-500 dark:text-slate-400 font-medium">Pending Approvals</div>
              <div className={`font-semibold ${actionRequiredCount > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
                {actionRequiredCount} Actions Needed
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <div className="text-slate-500 dark:text-slate-400 font-medium">Assaying Protocol</div>
              <div className="font-semibold text-slate-800 dark:text-white">Agmark / NABL Joint Inspection</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
