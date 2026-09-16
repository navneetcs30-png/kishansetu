import React from 'react';
import { 
  IndianRupee, 
  TrendingDown, 
  FileText, 
  RotateCcw, 
  ShieldCheck,
  UploadCloud,
  Building2
} from 'lucide-react';
import { formatINR, formatNumber } from '../utils/formatters';
import { OrganizationVerification } from '../types';
import { useLanguage } from '../../../src/i18n/LanguageContext';

interface HeaderStatsProps {
  totalProcurementValue: number;
  totalQuintals: number;
  totalBaseValue: number;
  selectedItemsCount: number;
  activeContractsCount?: number;
  actionRequiredCount?: number;
  verification: OrganizationVerification;
  onResetQuantities: () => void;
  onOpenOrderModal: () => void;
  onOpenVerificationModal: () => void;
  desktopLayout?: 'grid' | 'tabs';
  onSelectLayout?: (layout: 'grid' | 'tabs') => void;
  focusedTab?: 'procurement' | 'contracts' | 'guidance' | 'compliance';
  onSelectTab?: (tab: 'procurement' | 'contracts' | 'guidance' | 'compliance') => void;
}

export const HeaderStats: React.FC<HeaderStatsProps> = ({
  totalProcurementValue,
  totalQuintals,
  totalBaseValue,
  selectedItemsCount,
  activeContractsCount = 0,
  verification,
  onResetQuantities,
  onOpenOrderModal,
  onOpenVerificationModal,
  desktopLayout = 'tabs',
  onSelectLayout,
  focusedTab = 'procurement',
  onSelectTab,
}) => {
  const { t } = useLanguage();
  const volumeSavings = Math.max(0, totalBaseValue - totalProcurementValue);
  const metricTonnes = (totalQuintals / 10).toFixed(1);

  const handleTabClick = (tab: 'procurement' | 'contracts' | 'guidance' | 'compliance') => {
    if (onSelectTab) onSelectTab(tab);
    if (onSelectLayout) onSelectLayout('tabs');
    const mainEl = document.getElementById('dashboard-main');
    if (mainEl) {
      window.scrollTo({ top: mainEl.offsetTop - 70, behavior: 'smooth' });
    }
  };

  const handleGridClick = () => {
    if (onSelectLayout) onSelectLayout('grid');
    const mainEl = document.getElementById('dashboard-main');
    if (mainEl) {
      window.scrollTo({ top: mainEl.offsetTop - 70, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Title, Organization & KYC Verification Status */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {t('bulkBuyer.toolbarTitle', 'Enterprise B2B Procurement Desk')}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/80">
              <Building2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-semibold text-slate-800 dark:text-white">{verification.companyName}</span>
              <span className="text-slate-400 hidden sm:inline">• Lic: {verification.mandiLicenseNo}</span>
            </div>

            <button
              type="button"
              onClick={onOpenVerificationModal}
              id="header-verification-badge-btn"
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                verification.overallStatus === 'Verified'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900'
                  : 'bg-amber-950 text-amber-300 border border-amber-600/50 hover:bg-amber-900'
              }`}
            >
              {verification.overallStatus === 'Verified' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('bulkBuyer.gstVerified', 'GST & Mandi Verified')}</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                  <span>{t('bulkBuyer.uploadGst', 'Upload GST to Verify')}</span>
                </>
              )}
            </button>
          </div>

          {/* Running Live Total Box & Order Action */}
          <div className="flex flex-wrap items-center gap-3">
            <div 
              id="running-procurement-total-box"
              className="bg-slate-900 dark:bg-slate-950 text-white rounded-xl px-3.5 py-2 shadow-sm border border-slate-800 min-w-[220px]"
              role="region"
              aria-label="Running Total Procurement Value"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                <span className="uppercase tracking-wider font-semibold flex items-center gap-1 text-emerald-400">
                  <IndianRupee className="w-3 h-3" />
                  {t('bulkBuyer.totalValue', 'Total Procurement Value')}
                </span>
                {selectedItemsCount > 0 && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-medium">
                    Live
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between gap-3">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-emerald-400">
                  {formatINR(totalProcurementValue)}
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  {totalQuintals > 0 ? `${formatNumber(totalQuintals)} Q (${metricTonnes} MT)` : '0 Quintals'}
                </span>
              </div>

              {volumeSavings > 0 && (
                <div className="mt-1 pt-1 border-t border-slate-800 text-[10px] text-amber-400 font-medium flex items-center gap-1">
                  <TrendingDown className="w-2.5 h-2.5" />
                  <span>Save {formatINR(volumeSavings)} (Volume Tier)</span>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="header-order-action-btn"
                disabled={totalProcurementValue === 0}
                onClick={onOpenOrderModal}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t('bulkBuyer.placeOrder', 'Place Order / Quote')}</span>
              </button>

              {selectedItemsCount > 0 && (
                <button
                  type="button"
                  onClick={onResetQuantities}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
                  title="Reset all commodity procurement quantities"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Header Panel Switcher Navigation Tabs */}
        <div className="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:inline mr-1">
              Panels:
            </span>

            <button
              type="button"
              id="header-tab-procurement"
              onClick={() => handleTabClick('procurement')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                desktopLayout === 'tabs' && focusedTab === 'procurement'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>🌾 Bulk Procurement</span>
              {selectedItemsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-bold">
                  {selectedItemsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              id="header-tab-contracts"
              onClick={() => handleTabClick('contracts')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                desktopLayout === 'tabs' && focusedTab === 'contracts'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>📋 Active Contracts</span>
              {activeContractsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-bold">
                  {activeContractsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              id="header-tab-guidance"
              onClick={() => handleTabClick('guidance')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                desktopLayout === 'tabs' && focusedTab === 'guidance'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>🔍 Quality Guidance</span>
            </button>

            <button
              type="button"
              id="header-tab-compliance"
              onClick={() => handleTabClick('compliance')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                desktopLayout === 'tabs' && focusedTab === 'compliance'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>📜 Schemes & Compliance</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <button
              type="button"
              id="header-tab-grid"
              onClick={handleGridClick}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1 text-[11px] ${
                desktopLayout === 'grid'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
              title="Show all 4 panels simultaneously in 2x2 grid"
            >
              <span>🎛️ 2×2 Grid View</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
