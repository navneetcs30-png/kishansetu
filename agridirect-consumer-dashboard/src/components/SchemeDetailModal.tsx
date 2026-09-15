import React from 'react';
import { ConsumerScheme } from '../types';
import { X, ExternalLink, ShieldCheck, CheckCircle2, Building2, FileText, Tag } from 'lucide-react';

interface SchemeDetailModalProps {
  scheme: ConsumerScheme | null;
  onClose: () => void;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({ scheme, onClose }) => {
  if (!scheme) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="scheme-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-start justify-between gap-3">
          <div>
            <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-1.5 ${
              scheme.type === 'offer'
                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
            }`}>
              {scheme.tag}
            </span>
            <h3 id="scheme-modal-title" className="text-base sm:text-lg font-bold text-stone-900">
              {scheme.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Key Highlight Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-800 block">
                Primary Consumer Benefit
              </span>
              <p className="font-semibold text-stone-900 text-sm mt-0.5">
                {scheme.highlightBenefit}
              </p>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
              Overview
            </h4>
            <p className="text-stone-700 leading-relaxed text-xs sm:text-sm">
              {scheme.shortDesc}
            </p>
          </div>

          {/* Eligibility */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900 text-xs">Who is Eligible:</span>
                <p className="text-stone-600 text-xs mt-0.5">{scheme.eligibility}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2 border-t border-stone-200/60">
              <Building2 className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900 text-xs">Governing Agency / Partner:</span>
                <p className="text-stone-600 text-xs mt-0.5">{scheme.agencyOrSponsor}</p>
              </div>
            </div>
          </div>

          {/* How to Claim */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
              How to Avail / Claim
            </h4>
            <p className="text-stone-700 leading-relaxed text-xs">
              {scheme.howToClaim}
            </p>
          </div>

          {scheme.code && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-amber-900">Promo Code:</span>
                <code className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-amber-300">
                  {scheme.code}
                </code>
              </div>
              <span className="text-[11px] text-amber-800">Auto-applied in Cart</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          {scheme.officialRef.startsWith('http') ? (
            <a
              href={scheme.officialRef}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline"
            >
              <span>Official Government Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="text-xs text-stone-500 font-mono">
              Ref: {scheme.officialRef}
            </span>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
