import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  FileUp, 
  Bot, 
  RefreshCw
} from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { FarmerDocumentSubmission } from '../types';
import { useLanguage } from '../../../src/i18n/LanguageContext';

interface HeaderProps {
  totalGrainValue: number;
  totalVegetableValue: number;
  onResetAll: () => void;
  currentView?: 'farmer' | 'admin';
  onToggleView?: (view: 'farmer' | 'admin') => void;
  farmerSubmission?: FarmerDocumentSubmission;
  onOpenVerificationModal: () => void;
  pendingAdminCount?: number;
  onOpenAI?: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalGrainValue,
  totalVegetableValue,
  onResetAll,
  farmerSubmission,
  onOpenVerificationModal,
  onOpenAI,
}) => {
  const { t } = useLanguage();
  const grandTotal = totalGrainValue + totalVegetableValue;
  const status = farmerSubmission?.status || 'not_submitted';

  return (
    <div className="bg-emerald-900/95 dark:bg-slate-900 border-b border-emerald-800 dark:border-slate-800 text-white shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Context Title & Aadhaar KYC Status Pill */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>{t('farmer.toolbarTitle', 'Farmer Mandi & MSP Desk')}</span>
              </h2>
            </div>

            {/* Farmer Document KYC Status Badge */}
            <div className="flex items-center gap-2 ml-1">
              {status === 'verified' && (
                <button
                  type="button"
                  onClick={onOpenVerificationModal}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-emerald-100 px-3 py-1 rounded-full border border-emerald-500/60 shadow-xs transition-all cursor-pointer"
                  title="Aadhaar verified: Click to view details"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t('farmer.kycVerified', 'Aadhaar Verified')}</span>
                </button>
              )}

              {status === 'pending' && (
                <button
                  type="button"
                  onClick={onOpenVerificationModal}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-3 py-1 rounded-full border border-amber-400/50 shadow-xs transition-all cursor-pointer"
                  title="Aadhaar submitted: Verification pending"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>{t('farmer.kycPending', 'Verification In Progress')}</span>
                </button>
              )}

              {status === 'rejected' && (
                <button
                  type="button"
                  onClick={onOpenVerificationModal}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-rose-500/30 hover:bg-rose-500/40 text-rose-200 px-3 py-1 rounded-full border border-rose-400/50 shadow-xs transition-all cursor-pointer"
                  title="Document action needed: Click to re-upload"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
                  <span>{t('farmer.kycPending', 'Re-upload Needed')}</span>
                </button>
              )}

              {status === 'not_submitted' && (
                <button
                  type="button"
                  onClick={onOpenVerificationModal}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-emerald-950 px-3 py-1 rounded-full shadow-xs transition-all cursor-pointer"
                  title="Upload Aadhaar card for KYC verification"
                >
                  <FileUp className="w-3.5 h-3.5" />
                  <span>{t('farmer.uploadKyc', 'Upload Aadhaar')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Live Total Running Earnings & Actions Bar */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Live Calculation Box */}
            <div className="bg-emerald-950/80 dark:bg-slate-950 border border-emerald-800 dark:border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-3 shadow-xs">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-300">
                  {t('farmer.liveEarnings', 'Live Benchmark Value')}
                </span>
                <span className="text-base sm:text-lg font-black text-amber-300 tracking-tight leading-tight">
                  {formatINR(grandTotal)}
                </span>
              </div>

              <div className="h-6 w-px bg-emerald-800/80 dark:bg-slate-800" />

              <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-300">
                <span className="bg-emerald-900/70 px-2 py-0.5 rounded border border-emerald-800/60">
                  MSP: <strong className="text-white">{formatINR(totalGrainValue)}</strong>
                </span>
                <span className="bg-emerald-900/70 px-2 py-0.5 rounded border border-emerald-800/60">
                  Mandi: <strong className="text-white">{formatINR(totalVegetableValue)}</strong>
                </span>
              </div>

              {/* Reset Action */}
              <button
                type="button"
                onClick={onResetAll}
                className="p-1.5 rounded-lg bg-emerald-800/60 hover:bg-emerald-800 text-emerald-200 hover:text-white transition cursor-pointer"
                title={t('farmer.resetCalc', 'Reset Calculation')}
                aria-label="Reset entered quantities"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Kisan AI Assistant Trigger */}
            {onOpenAI && (
              <button
                type="button"
                onClick={onOpenAI}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
                title="Ask Kisan Sahayak AI about crops, rates, and schemes"
              >
                <Bot className="w-4 h-4" />
                <span>{t('farmer.aiAssistantBtn', 'Kisan AI Sahayak')}</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
