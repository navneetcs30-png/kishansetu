import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  TrendingDown, 
  Check, 
  Building, 
  MapPin, 
  Calendar, 
  ArrowRight,
  PackageCheck,
  Percent,
  Warehouse,
  Plus,
  Minus
} from 'lucide-react';
import { Commodity } from '../types';
import { formatINR, formatNumber, getEffectiveRate, getNextTierInfo } from '../utils/formatters';

interface ProcurementPanelProps {
  commodities: Commodity[];
  quantities: Record<string, number>;
  onQuantityChange: (commodityId: string, quantity: number) => void;
  onRequestQuote: () => void;
  onPlaceBulkOrder: () => void;
  onOpenRaiseDemand?: () => void;
}

export const ProcurementPanel: React.FC<ProcurementPanelProps> = ({
  commodities,
  quantities,
  onQuantityChange,
  onRequestQuote,
  onPlaceBulkOrder,
  onOpenRaiseDemand,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Grains & Cereals', 'Vegetables & Tubers', 'Pulses & Oilseeds'];

  const filteredCommodities = commodities.filter((comm) => {
    const matchesCategory = selectedCategory === 'All' || comm.category === selectedCategory;
    const matchesSearch = 
      comm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comm.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comm.fpoSupplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comm.origin.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate panel subtotal
  let panelSubtotal = 0;
  let totalSelectedItems = 0;
  let totalQuintals = 0;

  commodities.forEach((c) => {
    const qty = quantities[c.id] || 0;
    if (qty > 0) {
      totalSelectedItems += 1;
      totalQuintals += qty;
      const { rate } = getEffectiveRate(c, qty);
      panelSubtotal += qty * rate;
    }
  });

  return (
    <section 
      id="procurement-panel" 
      aria-labelledby="procurement-panel-title"
      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-full overflow-hidden"
    >
      {/* Panel Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-emerald-50/50 dark:from-emerald-950/30 via-white dark:via-slate-900 to-transparent">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 id="procurement-panel-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
                Bulk Procurement Panel
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Available farmer & FPO listings with automatic tiered volume discounts per quintal.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenRaiseDemand && (
              <button
                type="button"
                id="btn-post-rfq-open"
                onClick={onOpenRaiseDemand}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition"
                title="Post an RFQ/Demand for commodities from farmers"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post RFQ (मांग दर्ज करें)</span>
              </button>
            )}
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {filteredCommodities.length} Commodities Available
            </span>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="mt-3.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              id="procurement-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wheat, rice, potato, onion, mandi or FPO..."
              aria-label="Search available bulk commodities"
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-lg focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none" role="tablist" aria-label="Commodity categories">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap text-xs px-2.5 py-1.5 rounded-lg font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 dark:bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Commodity Listings List / Grid */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 max-h-[620px] scrollbar-thin">
        {filteredCommodities.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-850/40">
            <PackageCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No commodities match your criteria</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try selecting "All" categories or refining your search term.</p>
          </div>
        ) : (
          filteredCommodities.map((item) => {
            const currentQty = quantities[item.id] || 0;
            const { rate: effectiveRate, activeTier, discountPercent } = getEffectiveRate(item, currentQty);
            const lineSubtotal = currentQty * effectiveRate;
            const nextTierInfo = getNextTierInfo(item, currentQty);

            return (
              <article
                key={item.id}
                id={`commodity-card-${item.id}`}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                  currentQty > 0
                    ? 'border-emerald-500 dark:border-emerald-500/80 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  {/* Left Column: Image & Details */}
                  <div className="flex items-start gap-3 flex-1">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-slate-200 dark:border-slate-750 shrink-0 bg-slate-100 dark:bg-slate-800"
                      loading="lazy"
                    />

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {item.grade}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Warehouse className="w-3 h-3 text-slate-400" />
                          {item.storageType}
                        </span>
                        {(item.variety.includes('Direct Farmer Lot') || item.fpoSupplier.includes('Individual Farmer') || item.id.startsWith('prod-farm-')) && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60">
                            👨‍🌾 Direct Farmer Lot (सीधा किसान से)
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        {item.variety} • Moisture: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.moistureContent}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                          <Building className="w-3 h-3 text-emerald-600 shrink-0" />
                          {item.fpoSupplier}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          {item.origin}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                          Harvest: {item.harvestDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stock & Base Price Column */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-1 shrink-0 pt-1 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="text-left md:text-right">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Base Mandi Rate</div>
                      <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {formatINR(item.basePricePerQuintal)}
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400"> / quintal</span>
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Stock: </span>
                      <span className="font-semibold text-emerald-800 dark:text-emerald-400">{formatNumber(item.availableStockQuintals)} Q</span>
                      <span className="text-slate-400 dark:text-slate-500 text-[10px]"> (MOQ: {item.minOrderQuantity} Q)</span>
                    </div>
                  </div>
                </div>

                {/* Tiered Pricing Schedule visual strip */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
                    <span className="font-semibold uppercase tracking-wider flex items-center gap-1 text-slate-700 dark:text-slate-300">
                      <Percent className="w-3 h-3 text-emerald-600" />
                      Bulk Volume Pricing Tiers (Per Quintal)
                    </span>
                    {activeTier && discountPercent > 0 && (
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Tier Active ({discountPercent}% Discount applied)
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-xs">
                    {item.tiers.map((tier, idx) => {
                      const isQualifying = currentQty >= tier.minQty && (tier.maxQty ? currentQty <= tier.maxQty : true);
                      return (
                        <div
                          key={idx}
                          className={`p-1.5 sm:p-2 rounded-lg border text-xs transition ${
                            isQualifying
                              ? 'bg-emerald-700 dark:bg-emerald-600 text-white border-emerald-800 dark:border-emerald-500 shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className={`text-[10px] font-medium ${isQualifying ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
                            {tier.maxQty ? `${tier.minQty} - ${tier.maxQty} Q` : `${tier.minQty}+ Q`}
                          </div>
                          <div className="font-bold text-xs sm:text-sm tracking-tight mt-0.5">
                            {formatINR(tier.ratePerQuintal)}/Q
                          </div>
                          {tier.discountPercent ? (
                            <div className={`text-[10px] font-semibold mt-0.5 ${isQualifying ? 'text-amber-300' : 'text-emerald-700 dark:text-emerald-400'}`}>
                              Save {tier.discountPercent}%
                            </div>
                          ) : (
                            <div className={`text-[10px] mt-0.5 ${isQualifying ? 'text-emerald-200' : 'text-slate-400 dark:text-slate-500'}`}>
                              Standard
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Nudge for unlocking next tier if close */}
                  {nextTierInfo && currentQty > 0 && (
                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800/60">
                      <span className="flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 text-amber-600" />
                        Add <strong className="font-semibold">{nextTierInfo.neededQty} Q</strong> more to reach{' '}
                        {nextTierInfo.nextTier?.minQty}+ Q tier ({formatINR(nextTierInfo.nextTier?.ratePerQuintal || 0)}/Q)
                      </span>
                      <button
                        type="button"
                        onClick={() => onQuantityChange(item.id, nextTierInfo.nextTier?.minQty || currentQty)}
                        className="text-amber-900 dark:text-amber-200 underline font-semibold hover:text-amber-950 dark:hover:text-amber-100 ml-2 whitespace-nowrap"
                      >
                        Apply {nextTierInfo.nextTier?.minQty} Q
                      </button>
                    </div>
                  )}
                </div>

                {/* Quantity Input & Subtotal Line */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-950/60 -mx-3.5 -mb-3.5 sm:-mx-4 sm:-mb-4 p-3 rounded-b-xl">
                  {/* Left: Input with Labels and +/- Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <label 
                      htmlFor={`qty-input-${item.id}`}
                      className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Required Qty (Q):
                    </label>

                    <div className="flex items-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xs overflow-hidden">
                      <button
                        type="button"
                        aria-label={`Decrease ${item.name} quantity by 10 quintals`}
                        disabled={currentQty <= 0}
                        onClick={() => onQuantityChange(item.id, Math.max(0, currentQty - 10))}
                        className="px-2 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <input
                        type="number"
                        id={`qty-input-${item.id}`}
                        min={0}
                        max={item.availableStockQuintals}
                        step={10}
                        value={currentQty === 0 ? '' : currentQty}
                        placeholder="0"
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          onQuantityChange(item.id, isNaN(val) ? 0 : Math.max(0, val));
                        }}
                        className="w-20 text-center py-1 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white bg-transparent focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none border-x border-slate-200 dark:border-slate-700"
                        aria-describedby={`subtotal-desc-${item.id}`}
                      />

                      <button
                        type="button"
                        aria-label={`Increase ${item.name} quantity by 10 quintals`}
                        onClick={() => onQuantityChange(item.id, currentQty + 10)}
                        className="px-2 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onQuantityChange(item.id, item.minOrderQuantity)}
                        className="text-[11px] px-2 py-1 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium transition"
                      >
                        MOQ ({item.minOrderQuantity} Q)
                      </button>
                      <button
                        type="button"
                        onClick={() => onQuantityChange(item.id, item.tiers[item.tiers.length - 1].minQty)}
                        className="text-[11px] px-2 py-1 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium transition"
                      >
                        Max Tier ({item.tiers[item.tiers.length - 1].minQty} Q)
                      </button>
                    </div>
                  </div>

                  {/* Right: Calculated Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 text-right">
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {currentQty > 0 ? (
                          <>
                            {currentQty} Q @ {formatINR(effectiveRate)}/Q
                          </>
                        ) : (
                          'Item Subtotal'
                        )}
                      </div>
                      <div 
                        id={`subtotal-desc-${item.id}`}
                        className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-display"
                      >
                        {formatINR(lineSubtotal)}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Sticky Bottom Procurement Action Strip */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Procurement Subtotal ({totalSelectedItems} items, {formatNumber(totalQuintals)} Q / {(totalQuintals/10).toFixed(1)} MT):
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
              {formatINR(panelSubtotal)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="procurement-request-quote-btn"
              disabled={panelSubtotal === 0}
              onClick={onRequestQuote}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm transition disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:outline-none"
            >
              Request Custom Quote
            </button>

            <button
              type="button"
              id="procurement-place-order-btn"
              disabled={panelSubtotal === 0}
              onClick={onPlaceBulkOrder}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-700 dark:bg-emerald-600 hover:bg-emerald-800 dark:hover:bg-emerald-500 active:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
            >
              Place Bulk Order
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
