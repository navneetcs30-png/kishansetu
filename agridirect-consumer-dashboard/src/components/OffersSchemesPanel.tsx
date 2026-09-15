import React, { useState } from 'react';
import { ConsumerScheme } from '../types';
import {
  Tag,
  Building,
  ExternalLink,
  Percent,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';

interface OffersSchemesPanelProps {
  schemes: ConsumerScheme[];
  onSelectScheme: (scheme: ConsumerScheme) => void;
}

export const OffersSchemesPanel: React.FC<OffersSchemesPanelProps> = ({
  schemes,
  onSelectScheme
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'offers' | 'schemes'>('all');

  const filteredSchemes = schemes.filter((s) => {
    if (activeTab === 'offers') return s.type === 'offer';
    if (activeTab === 'schemes') return s.type === 'scheme';
    return true;
  });

  return (
    <section
      id="panel-offers"
      aria-labelledby="offers-heading"
      className="bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col h-full overflow-hidden"
    >
      {/* Panel Header */}
      <div className="p-5 sm:p-6 border-b border-stone-200 bg-stone-50/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 id="offers-heading" className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                Offers & Consumer Schemes
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Active buyer discounts, cooperative rebates & essential government market stabilization initiatives.
            </p>
          </div>

          {/* Tab Filter */}
          <div className="flex items-center bg-stone-200/80 p-0.5 rounded-xl text-xs font-medium border border-stone-300">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All ({schemes.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('offers')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'offers'
                  ? 'bg-white text-amber-800 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Offers ({schemes.filter((s) => s.type === 'offer').length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('schemes')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'schemes'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Govt Schemes ({schemes.filter((s) => s.type === 'scheme').length})
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="p-4 sm:p-6 flex-1 overflow-y-auto max-h-[600px] space-y-3.5">
        {filteredSchemes.map((item) => {
          const isOffer = item.type === 'offer';

          return (
            <article
              key={item.id}
              className={`p-4 sm:p-4.5 rounded-xl border transition-all hover:shadow-xs flex flex-col justify-between gap-3 ${
                isOffer
                  ? 'border-amber-200/80 bg-amber-50/20 hover:border-amber-300'
                  : 'border-emerald-200/80 bg-emerald-50/20 hover:border-emerald-300'
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      isOffer
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    }`}
                  >
                    {item.tag}
                  </span>

                  <span className="text-[11px] text-stone-500 font-medium">
                    {item.agencyOrSponsor}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-stone-900 tracking-tight">
                  {item.title}
                </h3>

                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {item.shortDesc}
                </p>

                {/* Highlighted Value Prop */}
                <div className="mt-2.5 p-2.5 rounded-lg bg-white border border-stone-200/70 text-xs font-semibold text-stone-900 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isOffer ? (
                      <Percent className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                    <span className="text-emerald-900">{item.highlightBenefit}</span>
                  </div>

                  {item.code && (
                    <span className="font-mono text-[11px] bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 text-stone-700">
                      Code: {item.code}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                <span className="text-[11px] text-stone-500 line-clamp-1">
                  Eligible: {item.eligibility}
                </span>

                <button
                  type="button"
                  onClick={() => onSelectScheme(item)}
                  className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-900 hover:underline shrink-0 ml-2 cursor-pointer"
                >
                  <span>Learn more</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
