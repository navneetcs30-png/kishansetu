import React from 'react';
import { Wheat, Info, RotateCcw, Plus, Sparkles, Tag } from 'lucide-react';
import { CropRateItem } from '../types';
import { formatINR, formatNumber } from '../utils/formatters';

interface GrainRatesPanelProps {
  crops: CropRateItem[];
  quantities: Record<string, number>;
  onQuantityChange: (cropId: string, value: number) => void;
  onResetCrops: () => void;
  isFarmerVerified?: boolean;
  onListCropForSale?: (crop: CropRateItem) => void;
}

const CROP_FALLBACK_IMAGES: Record<string, string> = {
  wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  maize: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
  mustard: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80',
  gram: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80',
  bajra: 'https://images.unsplash.com/photo-1627920769842-6887c6df05ca?auto=format&fit=crop&w=600&q=80',
};

export const GrainRatesPanel: React.FC<GrainRatesPanelProps> = ({
  crops,
  quantities,
  onQuantityChange,
  onResetCrops,
  isFarmerVerified,
  onListCropForSale,
}) => {
  // Calculate subtotal for grain sales
  const totalGrainValue = crops.reduce((sum, crop) => {
    const qty = quantities[crop.id] || 0;
    return sum + qty * crop.mspRate;
  }, 0);

  const totalQuintals = crops.reduce((sum, crop) => {
    return sum + (quantities[crop.id] || 0);
  }, 0);

  const handleInputChange = (cropId: string, rawVal: string) => {
    if (rawVal === '') {
      onQuantityChange(cropId, 0);
      return;
    }
    const val = parseFloat(rawVal);
    if (!isNaN(val) && val >= 0) {
      onQuantityChange(cropId, Math.min(val, 100000));
    }
  };

  const handleAddPreset = (cropId: string, amount: number) => {
    const current = quantities[cropId] || 0;
    onQuantityChange(cropId, current + amount);
  };

  return (
    <section
      id="panel-grains"
      aria-labelledby="heading-grain-rates"
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col h-full overflow-hidden transition-colors"
    >
      {/* Panel Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-b from-amber-50/70 to-white dark:from-amber-950/30 dark:to-slate-900">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center justify-center border border-amber-200/80 dark:border-amber-800/60 shadow-2xs flex-shrink-0">
              <Wheat className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="heading-grain-rates" className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight font-display">
                  Grain & Crop Rates (MSP)
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100/90 dark:bg-amber-950/90 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                  Panel 1
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Government Minimum Support Price calculator for major cereal, pulse & oilseed crops
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onResetCrops}
            className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors inline-flex items-center gap-1"
            title="Clear entered grain quantities"
            aria-label="Clear grain quantities"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>

        {/* Clear Sample Benchmark Notice */}
        <div className="mt-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/60 p-2.5 flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
          <Info className="w-4 h-4 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-semibold">Sample Benchmark Rates:</span> MSP values shown below represent indicative central government benchmark rates per quintal (100 kg) for planning and educational calculations.
          </div>
        </div>

        {/* Verification Benefit Indicator */}
        {isFarmerVerified && (
          <div className="mt-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 p-2.5 flex items-center justify-between text-xs text-emerald-950 dark:text-emerald-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span className="font-bold">Aadhaar e-KYC Verified:</span>
              <span className="text-[11px] text-emerald-800 dark:text-emerald-300">Authorized for direct Mandi MSP tokens & electronic bank payout (DBT).</span>
            </div>
            <span className="text-[10px] font-bold uppercase bg-emerald-700 text-white px-2 py-0.5 rounded shadow-2xs">
              Fast-Track Clearance
            </span>
          </div>
        )}
      </div>

      {/* Crops Rate List & Inputs */}
      <div className="p-4 sm:p-5 flex-1 divide-y divide-slate-100 dark:divide-slate-800">
        <div className="space-y-4">
          {crops.map((crop) => {
            const qty = quantities[crop.id] || 0;
            const rowTotal = qty * crop.mspRate;
            const inputId = `grain-qty-${crop.id}`;
            const cropImage = crop.imageUrl || CROP_FALLBACK_IMAGES[crop.id] || CROP_FALLBACK_IMAGES.wheat;

            return (
              <div
                key={crop.id}
                className="pt-3.5 first:pt-0 transition-colors group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Crop Info & Thumbnail */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Crop Image Thumbnail */}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-amber-200/90 dark:border-amber-800/70 shadow-2xs group-hover:shadow-md transition-all bg-amber-50 dark:bg-amber-950/40">
                      <img
                        src={cropImage}
                        alt={crop.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = CROP_FALLBACK_IMAGES.wheat;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute bottom-1 left-1 text-[9px] font-bold text-white bg-black/60 backdrop-blur-xs px-1 rounded leading-tight">
                        {crop.season}
                      </span>
                    </div>

                    {/* Crop Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base tracking-tight">
                          {crop.name}
                        </span>
                        <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                          ({crop.hindiName})
                        </span>
                        {crop.badge && (
                          <span className="text-[10px] font-semibold bg-amber-100/90 dark:bg-amber-950/90 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800 hidden sm:inline-block">
                            {crop.badge}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/80 dark:border-emerald-800/60">
                          Govt MSP: {formatINR(crop.mspRate)}
                        </span>
                        <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                          / quintal (100 kg)
                        </span>
                      </div>

                      {onListCropForSale && (
                        <div className="mt-2">
                          <button
                            type="button"
                            onClick={() => onListCropForSale(crop)}
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-700/60 transition cursor-pointer shadow-2xs"
                            title={`Submit ${crop.name} to marketplace for Consumers and Bulk Buyers`}
                          >
                            <Tag className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>List for Sale (बाज़ार में बेचें)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity Input with Quick Taps */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <div className="relative">
                      <label htmlFor={inputId} className="sr-only">
                        Sell quantity of {crop.name} in quintals
                      </label>
                      <input
                        id={inputId}
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        value={qty === 0 ? '' : qty}
                        onChange={(e) => handleInputChange(crop.id, e.target.value)}
                        className="w-24 sm:w-28 text-right font-mono font-semibold text-slate-900 dark:text-slate-100 text-sm px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-slate-800 placeholder-slate-400 dark:placeholder-slate-500 transition-shadow"
                      />
                      <span className="absolute right-7 top-2 text-[10px] text-slate-400 pointer-events-none hidden">
                        qtl
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap min-w-[32px]">
                      qtl
                    </span>

                    {/* Quick Preset Adders */}
                    <div className="hidden sm:flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleAddPreset(crop.id, 10)}
                        className="px-2 py-1 text-[11px] font-medium rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/80 hover:text-amber-900 dark:hover:text-amber-200 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-500"
                        title={`Add 10 quintals of ${crop.name}`}
                        aria-label={`Add 10 quintals of ${crop.name}`}
                      >
                        +10
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddPreset(crop.id, 25)}
                        className="px-2 py-1 text-[11px] font-medium rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/80 hover:text-amber-900 dark:hover:text-amber-200 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-500"
                        title={`Add 25 quintals of ${crop.name}`}
                        aria-label={`Add 25 quintals of ${crop.name}`}
                      >
                        +25
                      </button>
                    </div>
                  </div>

                  {/* Calculated Row Sale Value */}
                  <div className="sm:text-right min-w-[110px] pt-1 sm:pt-0 border-t border-dashed border-slate-100 dark:border-slate-800 sm:border-0 flex sm:flex-col justify-between sm:justify-center items-baseline sm:items-end">
                    <span className="text-[11px] text-slate-400 sm:hidden">Est. Value:</span>
                    <span className={`font-mono text-sm font-bold ${rowTotal > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-slate-400 dark:text-slate-600'}`}>
                      {formatINR(rowTotal)}
                    </span>
                    {qty > 0 && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        ({formatNumber(qty)} qtl × {formatINR(crop.mspRate)})
                      </span>
                    )}
                  </div>
                </div>

                {/* Mobile Quick Tap buttons */}
                <div className="flex sm:hidden items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400">Quick add:</span>
                  <button
                    type="button"
                    onClick={() => handleAddPreset(crop.id, 5)}
                    className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    +5 qtl
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddPreset(crop.id, 10)}
                    className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    +10 qtl
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddPreset(crop.id, 50)}
                    className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    +50 qtl
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subtotal Footer */}
      <div className="p-4 sm:p-5 bg-amber-50/50 dark:bg-amber-950/30 border-t border-amber-100 dark:border-amber-900/60 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
            Grain Total Estimated Value
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {totalQuintals > 0 ? `${formatNumber(totalQuintals)} Quintals allocated` : 'Enter quantities above to calculate'}
          </span>
        </div>
        <div className="text-right">
          <div className="text-lg sm:text-xl font-black text-amber-800 dark:text-amber-400 font-mono tracking-tight">
            {formatINR(totalGrainValue)}
          </div>
          <span className="text-[10px] text-amber-700 dark:text-amber-300/80 font-medium block">
            Assumes Standard FAQ Specs
          </span>
        </div>
      </div>
    </section>
  );
};
