import React from 'react';
import { Sprout, RefreshCw, Calculator, ShieldCheck, Clock, AlertTriangle, UserCheck, FileUp, Bot, Sun, Moon } from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { FarmerDocumentSubmission } from '../types';

interface HeaderProps {
  totalGrainValue: number;
  totalVegetableValue: number;
  onResetAll: () => void;
  currentView: 'farmer' | 'admin';
  onToggleView: (view: 'farmer' | 'admin') => void;
  farmerSubmission?: FarmerDocumentSubmission;
  onOpenVerificationModal: () => void;
  pendingAdminCount: number;
  onOpenAI?: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalGrainValue,
  totalVegetableValue,
  onResetAll,
  currentView,
  onToggleView,
  farmerSubmission,
  onOpenVerificationModal,
  pendingAdminCount,
  onOpenAI,
  isDark,
  onToggleTheme,
}) => {
  const grandTotal = totalGrainValue + totalVegetableValue;
  const status = farmerSubmission?.status || 'not_submitted';

  return (
    <header className="bg-emerald-900 text-white border-b border-emerald-800 shadow-sm">
      {/* Top Advisory & Role Switching Banner */}
      <div className="bg-emerald-950/90 px-4 py-2 border-b border-emerald-800/60 text-xs text-emerald-200/90 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
          <span className="font-semibold text-amber-200">Kisan Seva Portal:</span>
          <span className="text-emerald-300 hidden md:inline">Sample Planning Benchmarks & Official KYC Document Verification</span>
        </div>

        {/* Top actions: Theme Toggle & Portal Page Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 border border-emerald-700/80 text-xs font-semibold transition-all focus:outline-none focus:ring-1 focus:ring-amber-300"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-amber-200" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          )}

          {/* Portal Page Switcher: Farmer Page vs Admin Page */}
          <div className="flex items-center gap-1.5 bg-emerald-900/90 p-0.5 rounded-lg border border-emerald-700/80">
            <button
              type="button"
              onClick={() => onToggleView('farmer')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all focus:outline-none focus:ring-1 focus:ring-amber-300 ${
                currentView === 'farmer'
                  ? 'bg-amber-400 text-emerald-950 shadow-2xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              Farmer Page
            </button>
            <button
              type="button"
              onClick={() => onToggleView('admin')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-amber-300 ${
                currentView === 'admin'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              <span>Admin Page (Verify Documents)</span>
              {pendingAdminCount > 0 && (
                <span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {pendingAdminCount} Pending
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo, Title & Verification Badge */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-700/80 border border-emerald-600/60 flex items-center justify-center text-emerald-100 shadow-inner flex-shrink-0">
              <Sprout className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
                  {currentView === 'farmer' ? 'Farmer Dashboard' : 'Admin Verification Page'}
                </h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-700">
                  {currentView === 'farmer' ? 'किसान सेवा' : 'कृषि अधिकारी पोर्टल'}
                </span>

                {/* Farmer Document KYC Status Badge (in farmer view) */}
                {currentView === 'farmer' && (
                  <>
                    {status === 'verified' && (
                      <button
                        type="button"
                        onClick={onOpenVerificationModal}
                        className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-700/90 text-emerald-100 hover:bg-emerald-600 px-2.5 py-0.5 rounded-full border border-emerald-500 shadow-2xs transition-colors"
                        title="Aadhaar verified: Click to view details"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                        <span>Aadhaar Verified</span>
                      </button>
                    )}

                    {status === 'pending' && (
                      <button
                        type="button"
                        onClick={onOpenVerificationModal}
                        className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-500/30 text-amber-200 hover:bg-amber-500/40 px-2.5 py-0.5 rounded-full border border-amber-400/60 transition-colors"
                        title="Aadhaar submitted: Verification pending"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                        <span>Verification In Progress</span>
                      </button>
                    )}

                    {status === 'rejected' && (
                      <button
                        type="button"
                        onClick={onOpenVerificationModal}
                        className="inline-flex items-center gap-1 text-[11px] font-bold bg-rose-500/40 text-rose-200 hover:bg-rose-500/50 px-2.5 py-0.5 rounded-full border border-rose-400/60 transition-colors"
                        title="Document action needed: Click to re-upload"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
                        <span>Re-upload Needed</span>
                      </button>
                    )}

                    {status === 'not_submitted' && (
                      <button
                        type="button"
                        onClick={onOpenVerificationModal}
                        className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-400 text-emerald-950 hover:bg-amber-300 px-2.5 py-0.5 rounded-full transition-colors"
                        title="Upload Aadhaar card for KYC verification"
                      >
                        <FileUp className="w-3.5 h-3.5 text-emerald-950" />
                        <span>Upload Aadhaar</span>
                      </button>
                    )}
                  </>
                )}
              </div>
              <p className="text-xs sm:text-sm text-emerald-200/80 mt-0.5">
                {currentView === 'farmer'
                  ? 'Crop rates, mandi prices, production best practices & document upload'
                  : 'Official portal for Agriculture Officers to inspect Aadhaar documents and verify farmers'}
              </p>
            </div>
          </div>

          {/* Live Total Earnings Bar (Shown in farmer view) */}
          {currentView === 'farmer' && (
            <div className="bg-emerald-950/70 border border-emerald-800/80 rounded-xl p-3 sm:px-4 sm:py-2.5 flex flex-wrap items-center justify-between sm:justify-end gap-3 sm:gap-5 shadow-sm">
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-xs text-emerald-300 font-medium">
                  <Calculator className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Total Estimated Value</span>
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-amber-300 tracking-tight">
                  {formatINR(grandTotal)}
                </div>
              </div>

              <div className="h-9 w-px bg-emerald-800 hidden sm:block" aria-hidden="true" />

              {/* Split Breakdown */}
              <div className="flex items-center gap-2 text-xs">
                <div className="bg-emerald-900/90 px-2.5 py-1 rounded-md border border-emerald-800/60">
                  <span className="text-emerald-300 text-[11px] block">Grains (MSP):</span>
                  <span className="font-semibold text-white">{formatINR(totalGrainValue)}</span>
                </div>
                <div className="bg-emerald-900/90 px-2.5 py-1 rounded-md border border-emerald-800/60">
                  <span className="text-emerald-300 text-[11px] block">Vegetables:</span>
                  <span className="font-semibold text-white">{formatINR(totalVegetableValue)}</span>
                </div>
              </div>

              {/* Ask AI Action */}
              {onOpenAI && (
                <button
                  type="button"
                  onClick={onOpenAI}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-xs font-bold text-emerald-950 transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-amber-300"
                  title="Ask Kisan Sahayak AI about crops, rates, and schemes"
                  aria-label="Open Kisan Sahayak AI assistant"
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-950" />
                  <span>Ask AI</span>
                </button>
              )}

              {/* Theme Toggle Button */}
              {onToggleTheme && (
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-800/70 hover:bg-emerald-700 text-xs font-semibold text-amber-200 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300"
                  title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDark ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-amber-200" />}
                  <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
                </button>
              )}

              {/* Reset Quantities Action */}
              <button
                type="button"
                onClick={onResetAll}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-800/70 hover:bg-emerald-700 text-xs font-medium text-emerald-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-emerald-950"
                title="Reset all crop and vegetable entered quantities to zero"
                aria-label="Reset all entered quantities"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          )}

          {/* Quick return button when in Admin view */}
          {currentView === 'admin' && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onToggleView('farmer')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-xs transition-colors"
              >
                <Sprout className="w-4 h-4 text-emerald-950" />
                <span>Switch to Farmer View</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

