import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  CheckSquare, 
  Square, 
  FileCheck2, 
  Building2, 
  ArrowUpRight, 
  Landmark, 
  BadgeCheck, 
  HelpCircle,
  UploadCloud
} from 'lucide-react';
import { TradeScheme, OrganizationVerification } from '../types';

interface CompliancePanelProps {
  schemes: TradeScheme[];
  verification?: OrganizationVerification;
  onOpenSchemeModal: (scheme: TradeScheme) => void;
  onOpenVerificationModal?: () => void;
}

export const CompliancePanel: React.FC<CompliancePanelProps> = ({
  schemes,
  verification,
  onOpenSchemeModal,
  onOpenVerificationModal,
}) => {
  const isGSTVerified = !!verification?.gstDocument;
  const isLicenseVerified = !!verification?.licenseDocument;
  const isOverallVerified = verification?.overallStatus === 'Verified';

  // Buyer Compliance Readiness Checklist state
  const [checklist, setChecklist] = useState<{ id: string; label: string; checked: boolean; mandatory: boolean }[]>([
    { id: 'c1', label: 'Valid Mandi Single Unified Wholesale License', checked: isLicenseVerified, mandatory: true },
    { id: 'c2', label: 'Registered GSTIN with Exempt Agricultural Produce HSN codes', checked: isGSTVerified, mandatory: true },
    { id: 'c3', label: 'e-NAM Active Trader Account with Clearing Bank linkage', checked: true, mandatory: true },
    { id: 'c4', label: 'FSSAI Central Wholesale License for Grain & Food Storage', checked: false, mandatory: true },
    { id: 'c5', label: 'FPO Direct Institutional Procurement Bilateral MoU executed', checked: true, mandatory: false },
    { id: 'c6', label: 'WDRA e-NWR Electronic Pledge Facility Account', checked: false, mandatory: false },
  ]);

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const checkedCount = checklist.filter((item) => item.checked).length;
  const readinessPercent = Math.round((checkedCount / checklist.length) * 100);

  return (
    <section 
      id="compliance-panel" 
      aria-labelledby="compliance-panel-title"
      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-full overflow-hidden"
    >
      {/* Panel Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-emerald-50/30 dark:from-emerald-950/30 via-white dark:via-slate-900 to-transparent">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h2 id="compliance-panel-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
                Trade Schemes & Compliance Panel
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                e-NAM integration, FPO central schemes, GST/mandi tax waivers & AIF subsidies.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold">
            <BadgeCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>Readiness: {readinessPercent}%</span>
          </div>
        </div>
      </div>

      {/* Schemes Grid & Compliance Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 max-h-[620px] scrollbar-thin">
        {/* Organization KYC & Verification Status Box */}
        {verification && (
          <div className={`p-3.5 rounded-xl border transition ${
            isOverallVerified
              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80'
              : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/80'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isOverallVerified ? 'bg-emerald-700 text-white' : 'bg-amber-600 text-white'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Organization Verification: {verification.overallStatus}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                      isOverallVerified
                        ? 'bg-emerald-200 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                        : 'bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200'
                    }`}>
                      {verification.tier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {isOverallVerified
                      ? `GST Certificate (${verification.gstDocument?.name || 'Verified'}) & Mandi License attached. Credit limit: ₹50,00,000.`
                      : 'Upload GST Certificate (REG-06) and Mandi Trading License to unlock verified wholesale trade benefits.'}
                  </p>
                </div>
              </div>

              {onOpenVerificationModal && (
                <button
                  type="button"
                  onClick={onOpenVerificationModal}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                    isOverallVerified
                      ? 'bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-slate-700'
                      : 'bg-amber-700 hover:bg-amber-800 text-white shadow-xs'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{isOverallVerified ? 'View Documents' : 'Upload GST & License'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Scheme Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {schemes.map((scheme) => (
            <article
              key={scheme.id}
              id={`scheme-card-${scheme.id}`}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-emerald-300 dark:hover:border-emerald-700/60 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {scheme.shortTag}
                  </span>
                  {scheme.statusBadge && (
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      {scheme.statusBadge}
                    </span>
                  )}
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {scheme.title}
                </h3>
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2">
                  {scheme.authority}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-2.5">
                  {scheme.shortDescription}
                </p>

                {/* Key Benefits List */}
                <div className="space-y-1 mb-3">
                  {scheme.benefits.slice(0, 2).map((benefit, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                      <span className="line-clamp-1">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Action */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                  {scheme.eligibility.split(' ')[0]}...
                </span>

                <button
                  type="button"
                  onClick={() => onOpenSchemeModal(scheme)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-300 hover:underline"
                >
                  <span>Learn more & apply</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Buyer Compliance Readiness Checklist Box */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 bg-slate-50/80 dark:bg-slate-850/40">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Institutional Buyer Statutory Compliance Checklist
              </h4>
            </div>

            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {checkedCount} of {checklist.length} Verified
            </span>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
            Maintain statutory records to avail 0% GST exemption on raw commodities and avoid inter-state APMC toll levies.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {checklist.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleChecklistItem(item.id)}
                className="flex items-start gap-2.5 p-2 rounded-lg bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-left transition"
              >
                <span className="mt-0.5 shrink-0 text-emerald-700 dark:text-emerald-400">
                  {item.checked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  )}
                </span>
                <span className={`text-xs ${item.checked ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-300'}`}>
                  {item.label}
                  {item.mandatory && (
                    <span className="text-[10px] text-rose-600 font-bold ml-1">*Mandatory</span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          Certified Mandi Tax Exempt under Central APMC Modern Model Act
        </span>
        <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">
          CBIC Circular 140/2020 Compliant
        </span>
      </div>
    </section>
  );
};
