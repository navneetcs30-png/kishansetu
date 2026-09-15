import React, { useState } from 'react';
import { Landmark, ExternalLink, ShieldCheck, ChevronDown, Award, BadgePercent, Check } from 'lucide-react';
import { GovtScheme } from '../types';

interface GovernmentSchemesPanelProps {
  schemes: GovtScheme[];
  isFarmerVerified?: boolean;
}

export const GovernmentSchemesPanel: React.FC<GovernmentSchemesPanelProps> = ({ schemes, isFarmerVerified }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Schemes' },
    { id: 'Income Support', label: 'Income Support' },
    { id: 'Crop Insurance', label: 'Crop Insurance' },
    { id: 'Credit', label: 'Credit (KCC)' },
    { id: 'Soil Health', label: 'Soil Health' },
    { id: 'Irrigation Subsidy', label: 'Irrigation' },
    { id: 'Market Access', label: 'Market (e-NAM)' },
  ];

  const filteredSchemes = selectedCategory === 'all'
    ? schemes
    : schemes.filter(s => s.category === selectedCategory);

  return (
    <section
      id="panel-schemes"
      aria-labelledby="heading-govt-schemes"
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col h-full overflow-hidden transition-colors"
    >
      {/* Panel Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-b from-purple-50/60 to-white dark:from-purple-950/30 dark:to-slate-900">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 flex items-center justify-center border border-purple-200/80 dark:border-purple-800/60 shadow-2xs flex-shrink-0">
              <Landmark className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="heading-govt-schemes" className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight font-display">
                  Government Schemes
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100/90 dark:bg-purple-950/90 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                  Panel 4
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Financial support, crop insurance, credit & verified official ministry portals
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800 hidden sm:inline-block">
            Verified Portals
          </span>
        </div>

        {/* Category Filters */}
        <div className="mt-3.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                selectedCategory === cat.id
                  ? 'bg-purple-800 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scheme Cards Grid / List */}
      <div className="p-4 sm:p-5 flex-1 space-y-3.5 overflow-y-auto">
        {filteredSchemes.map((scheme) => (
          <article
            key={scheme.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/70 p-4 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                      {scheme.shortAcronym}
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      — {scheme.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    {scheme.hindiName}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {isFarmerVerified && (
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700 inline-flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                      <span>KYC Eligible</span>
                    </span>
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                    {scheme.category}
                  </span>
                </div>
              </div>

              {/* Benefit Highlight Pill */}
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800/60 text-xs font-semibold">
                <BadgePercent className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" aria-hidden="true" />
                <span>{scheme.benefitAmount}</span>
              </div>

              {/* Summary Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {scheme.summary}
              </p>

              {/* Native Accessible Details for Eligibility & Benefits */}
              <details className="mt-3 group/detail rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
                <summary className="p-2.5 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 rounded-lg">
                  <span className="flex items-center gap-1.5 text-purple-900 dark:text-purple-300 text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                    Eligibility Criteria & Benefits
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-open/detail:rotate-180 transition-transform" aria-hidden="true" />
                </summary>
                
                <div className="p-3 pt-1 border-t border-slate-200/80 dark:border-slate-800 space-y-2 text-slate-600 dark:text-slate-300">
                  <div>
                    <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200 block">Who is Eligible:</span>
                    <p className="text-[11px] mt-0.5 leading-relaxed">{scheme.eligibility}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200 block">Key Entitlements:</span>
                    <ul className="list-none space-y-1 mt-1">
                      {scheme.keyBenefits.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-1.5 text-[11px]">
                          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
            </div>

            {/* Official Portal Link */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono truncate">
                {scheme.portalName}
              </span>
              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 flex-shrink-0"
                aria-label={`Open official portal for ${scheme.shortAcronym} (opens in a new tab)`}
              >
                <span>Visit Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Panel Footer */}
      <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium">
          Ministry of Agriculture & Farmers Welfare, Govt. of India
        </span>
        <span className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold hidden sm:inline">
          Always register through .gov.in or .nic.in portals
        </span>
      </div>
    </section>
  );
};
