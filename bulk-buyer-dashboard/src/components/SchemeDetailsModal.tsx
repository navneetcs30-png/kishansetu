import React from 'react';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Building, 
  ArrowUpRight,
  Landmark,
  BadgeAlert
} from 'lucide-react';
import { TradeScheme } from '../types';

interface SchemeDetailsModalProps {
  scheme: TradeScheme | null;
  onClose: () => void;
}

export const SchemeDetailsModal: React.FC<SchemeDetailsModalProps> = ({
  scheme,
  onClose,
}) => {
  if (!scheme) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scheme-modal-title"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {scheme.shortTag}
                </span>
                <span className="text-xs text-slate-400">{scheme.authority}</span>
              </div>
              <h3 id="scheme-modal-title" className="text-base sm:text-lg font-bold font-display mt-0.5">
                {scheme.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-700 dark:text-slate-300">
          <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium bg-slate-50 dark:bg-slate-850 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
            {scheme.shortDescription}
          </div>

          {/* Benefits */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Institutional Buyer Benefits & Incentives
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {scheme.benefits.map((b, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-200 text-xs leading-normal">{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility & Compliance notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Eligibility Criteria
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                {scheme.eligibility}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1">
              <div className="font-bold text-amber-900 dark:text-amber-200 text-xs uppercase tracking-wider flex items-center gap-1">
                <BadgeAlert className="w-3.5 h-3.5 text-amber-700" />
                Compliance & Filing Mandates
              </div>
              <p className="text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
                {scheme.complianceNotes}
              </p>
            </div>
          </div>

          {/* Required Statutory Documents */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
            <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              Document Checklist for Scheme Enrollment
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
              <span className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-700">✓ GST Registration Certificate</span>
              <span className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-700">✓ Mandi Single Unified License</span>
              <span className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-700">✓ FSSAI Wholesale License</span>
              <span className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-700">✓ Bank Escrow Clearing Mandate</span>
              <span className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-700">✓ Audited Annual Balance Sheet</span>
              <span className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-700">✓ Board Resolution for Trading</span>
            </div>
          </div>

          {/* Official Portal Link & Actions */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <a
              href={scheme.keyLinkText}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-300 font-bold text-xs underline"
            >
              <span>Visit Official Government Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white text-xs font-semibold transition"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
