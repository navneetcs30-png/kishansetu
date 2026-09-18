import React, { useState } from 'react';
import { Carrot, Info, RotateCcw, Scale, Tag } from 'lucide-react';
import { VegetableItem } from '../types';
import { formatINR, formatNumber } from '../utils/formatters';

interface VegetableMarketPanelProps {
  vegetables: VegetableItem[];
  quantities: Record<string, number>;
  onQuantityChange: (vegId: string, value: number) => void;
  onResetVegetables: () => void;
  onListVegetableForSale?: (veg: VegetableItem) => void;
}

const VEGETABLE_FALLBACK_IMAGES: Record<string, string> = {
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
  onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
  cauliflower: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80',
  cabbage: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=600&q=80',
  green_peas: 'https://images.unsplash.com/photo-1592394533824-9440e5d68530?auto=format&fit=crop&w=600&q=80',
};

export const VegetableMarketPanel: React.FC<VegetableMarketPanelProps> = ({
  vegetables,
  quantities,
  onQuantityChange,
  onResetVegetables,
  onListVegetableForSale,
}) => {
  // Input unit mode: Quintals (100 kg) or Kilograms (kg)
  const [unitMode, setUnitMode] = useState<'quintal' | 'kg'>('quintal');

  // Calculate subtotal for vegetables
  const totalVegetableValue = vegetables.reduce((sum, veg) => {
    const rawQty = quantities[veg.id] || 0;
    // if in quintals, qty * mandiRatePerQuintal
    // if in kg, qty * (mandiRatePerQuintal / 100)
    const multiplier = unitMode === 'quintal' ? veg.mandiRatePerQuintal : veg.mandiRatePerQuintal / 100;
    return sum + rawQty * multiplier;
  }, 0);

  const handleInputChange = (vegId: string, rawVal: string) => {
    if (rawVal === '') {
      onQuantityChange(vegId, 0);
      return;
    }
    const val = parseFloat(rawVal);
    if (!isNaN(val) && val >= 0) {
      onQuantityChange(vegId, Math.min(val, 500000));
    }
  };

  const handleAddPreset = (vegId: string, amount: number) => {
    const current = quantities[vegId] || 0;
    onQuantityChange(vegId, current + amount);
  };

  return (
    <section
      id="panel-vegetables"
      aria-labelledby="heading-vegetable-rates"
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col h-full overflow-hidden transition-colors"
    >
      {/* Panel Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-b from-emerald-50/70 to-white dark:from-emerald-950/30 dark:to-slate-900">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs flex-shrink-0">
              <Carrot className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="heading-vegetable-rates" className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight font-display">
                  Vegetable Market (Mandi Rates)
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100/90 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                  Panel 2
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Current wholesale mandi price benchmarks & editable batch sales calculator
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onResetVegetables}
            className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors inline-flex items-center gap-1"
            title="Clear entered vegetable quantities"
            aria-label="Clear vegetable quantities"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>

        {/* Unit Selector & Sample Notice */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1">
              <Scale className="w-3 h-3 text-slate-400" aria-hidden="true" />
              Input Unit:
            </span>
            <button
              type="button"
              onClick={() => setUnitMode('quintal')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                unitMode === 'quintal'
                  ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Quintals (100 kg)
            </button>
            <button
              type="button"
              onClick={() => setUnitMode('kg')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                unitMode === 'kg'
                  ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Kilograms (kg)
            </button>
          </div>

          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Mandi wholesale basis
          </span>
        </div>

        {/* Sample Disclaimer Notice */}
        <div className="mt-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 p-2.5 flex items-start gap-2 text-xs text-emerald-950 dark:text-emerald-200">
          <Info className="w-4 h-4 text-emerald-700 dark:text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-semibold">Sample Mandi Figures:</span> Vegetable prices reflect educational mandi benchmark averages. Real auction prices fluctuate daily by lot quality, arrival supply, and grading.
          </div>
        </div>
      </div>

      {/* Vegetable Rows */}
      <div className="p-4 sm:p-5 flex-1 divide-y divide-slate-100 dark:divide-slate-800">
        <div className="space-y-4">
          {vegetables.map((veg) => {
            const rawQty = quantities[veg.id] || 0;
            const ratePerKg = veg.mandiRatePerQuintal / 100;
            const effectiveRate = unitMode === 'quintal' ? veg.mandiRatePerQuintal : ratePerKg;
            const rowTotal = rawQty * effectiveRate;
            const inputId = `veg-qty-${veg.id}`;
            const vegImage = veg.imageUrl || VEGETABLE_FALLBACK_IMAGES[veg.id] || VEGETABLE_FALLBACK_IMAGES.potato;

            const arrivalBadgeColor =
              veg.typicalArrival === 'High'
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                : veg.typicalArrival === 'Moderate'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';

            return (
              <div
                key={veg.id}
                className="pt-3.5 first:pt-0 transition-colors group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Veg Details & Thumbnail */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Vegetable Image Thumbnail */}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-emerald-200/90 dark:border-emerald-800/70 shadow-2xs group-hover:shadow-md transition-all bg-emerald-50 dark:bg-emerald-950/40">
                      <img
                        src={vegImage}
                        alt={veg.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = VEGETABLE_FALLBACK_IMAGES.potato;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                      <span className={`absolute bottom-1 left-1 text-[8px] font-bold px-1 rounded leading-tight shadow-xs ${
                        veg.typicalArrival === 'High' ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
                      }`}>
                        {veg.typicalArrival}
                      </span>
                    </div>

                    {/* Vegetable Text Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base tracking-tight">
                          {veg.name}
                        </span>
                        <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                          ({veg.hindiName})
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded hidden sm:inline-block">
                          {veg.primaryMarket}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/80 dark:border-emerald-800/60">
                          Mandi: {formatINR(veg.mandiRatePerQuintal)}/qtl
                        </span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium text-[11px]">
                          (~₹{ratePerKg.toFixed(1)}/kg)
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 sm:hidden">
                          • {veg.primaryMarket}
                        </span>
                      </div>

                      {onListVegetableForSale && (
                        <div className="mt-2">
                          <button
                            type="button"
                            onClick={() => onListVegetableForSale(veg)}
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-700/60 transition cursor-pointer shadow-2xs"
                            title={`Submit ${veg.name} to marketplace for Consumers and Bulk Buyers`}
                          >
                            <Tag className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>List for Sale (बाज़ार में बेचें)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity Input */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <div className="relative">
                      <label htmlFor={inputId} className="sr-only">
                        Sell quantity of {veg.name} in {unitMode === 'quintal' ? 'quintals' : 'kilograms'}
                      </label>
                      <input
                        id={inputId}
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        value={rawQty === 0 ? '' : rawQty}
                        onChange={(e) => handleInputChange(veg.id, e.target.value)}
                        className="w-24 sm:w-28 text-right font-mono font-semibold text-slate-900 dark:text-slate-100 text-sm px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-800 placeholder-slate-400 dark:placeholder-slate-500 transition-shadow"
                      />
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap min-w-[30px]">
                      {unitMode === 'quintal' ? 'qtl' : 'kg'}
                    </span>

                    {/* Quick Presets */}
                    <div className="hidden sm:flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleAddPreset(veg.id, unitMode === 'quintal' ? 5 : 50)}
                        className="px-2 py-1 text-[11px] font-medium rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/80 hover:text-emerald-900 dark:hover:text-emerald-200 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        title={`Add ${unitMode === 'quintal' ? '5 qtl' : '50 kg'}`}
                        aria-label={`Add ${unitMode === 'quintal' ? '5 qtl' : '50 kg'}`}
                      >
                        +{unitMode === 'quintal' ? '5' : '50'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddPreset(veg.id, unitMode === 'quintal' ? 10 : 100)}
                        className="px-2 py-1 text-[11px] font-medium rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/80 hover:text-emerald-900 dark:hover:text-emerald-200 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        title={`Add ${unitMode === 'quintal' ? '10 qtl' : '100 kg'}`}
                        aria-label={`Add ${unitMode === 'quintal' ? '10 qtl' : '100 kg'}`}
                      >
                        +{unitMode === 'quintal' ? '10' : '100'}
                      </button>
                    </div>
                  </div>

                  {/* Calculated Sale Value */}
                  <div className="sm:text-right min-w-[110px] pt-1 sm:pt-0 border-t border-dashed border-slate-100 dark:border-slate-800 sm:border-0 flex sm:flex-col justify-between sm:justify-center items-baseline sm:items-end">
                    <span className="text-[11px] text-slate-400 sm:hidden">Est. Mandi Value:</span>
                    <span className={`font-mono text-sm font-bold ${rowTotal > 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'}`}>
                      {formatINR(rowTotal)}
                    </span>
                    {rawQty > 0 && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        ({formatNumber(rawQty)} {unitMode === 'quintal' ? 'qtl' : 'kg'} @ {unitMode === 'quintal' ? formatINR(veg.mandiRatePerQuintal) : `₹${ratePerKg.toFixed(1)}/kg`})
                      </span>
                    )}
                  </div>
                </div>

                {/* Mobile Quick Add Presets */}
                <div className="flex sm:hidden items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400">Add:</span>
                  <button
                    type="button"
                    onClick={() => handleAddPreset(veg.id, unitMode === 'quintal' ? 2 : 25)}
                    className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    +{unitMode === 'quintal' ? '2 qtl' : '25 kg'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddPreset(veg.id, unitMode === 'quintal' ? 5 : 50)}
                    className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    +{unitMode === 'quintal' ? '5 qtl' : '50 kg'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddPreset(veg.id, unitMode === 'quintal' ? 10 : 100)}
                    className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    +{unitMode === 'quintal' ? '10 qtl' : '100 kg'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subtotal Footer */}
      <div className="p-4 sm:p-5 bg-emerald-50/50 dark:bg-emerald-950/30 border-t border-emerald-100 dark:border-emerald-900/60 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
            Vegetables Total Estimated Mandi Value
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Calculated in {unitMode === 'quintal' ? 'Quintals' : 'Kilograms'} basis
          </span>
        </div>
        <div className="text-right">
          <div className="text-lg sm:text-xl font-black text-emerald-800 dark:text-emerald-400 font-mono tracking-tight">
            {formatINR(totalVegetableValue)}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400/80 font-medium block">
            Wholesale Auction Pricing
          </span>
        </div>
      </div>
    </section>
  );
};
