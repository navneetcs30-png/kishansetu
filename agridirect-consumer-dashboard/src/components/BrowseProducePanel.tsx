import React, { useState } from 'react';
import { ProduceItem } from '../types';
import {
  Search,
  Filter,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
  Award,
  ArrowRight,
  Info,
  Scale
} from 'lucide-react';

interface BrowseProducePanelProps {
  produceList: ProduceItem[];
  cartQuantities: Record<string, number>;
  onUpdateQuantity: (produceId: string, quantity: number) => void;
  onClearCart: () => void;
  onProceedToOrder: () => void;
  subtotal: number;
  totalWeightKg: number;
  bulkDiscountAmount: number;
  finalCartAmount: number;
  onOpenRaiseDemand?: () => void;
}

export const BrowseProducePanel: React.FC<BrowseProducePanelProps> = ({
  produceList,
  cartQuantities,
  onUpdateQuantity,
  onClearCart,
  onProceedToOrder,
  subtotal,
  totalWeightKg,
  bulkDiscountAmount,
  finalCartAmount,
  onOpenRaiseDemand
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceUnitView, setPriceUnitView] = useState<'kg' | 'quintal'>('kg');

  const categories = ['All', '🌾 Direct From Farmers', 'Grains', 'Vegetables', 'Pulses & Seeds'];

  const filteredProduce = produceList.filter((item) => {
    const matchesCategory = 
      selectedCategory === 'All' || 
      (selectedCategory === '🌾 Direct From Farmers' ? item.variety.includes('Direct Farm Gate') || item.farmerName.includes('👨‍🌾') : item.category === selectedCategory);
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.hindiName && item.hindiName.includes(searchQuery)) ||
      item.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartItemCount = Object.values(cartQuantities).filter((q) => Number(q) > 0).length;

  const handleInputChange = (item: ProduceItem, valueStr: string) => {
    if (valueStr === '') {
      onUpdateQuantity(item.id, 0);
      return;
    }
    const val = parseFloat(valueStr);
    if (!isNaN(val) && val >= 0) {
      // Limit to available stock
      const safeVal = Math.min(val, item.stockKg);
      onUpdateQuantity(item.id, safeVal);
    }
  };

  const handleStep = (item: ProduceItem, delta: number) => {
    const current = cartQuantities[item.id] || 0;
    const stepSize = item.minOrderKg >= 5 ? 5 : item.minOrderKg >= 1 ? 1 : 0.5;
    let next = current + delta * stepSize;
    if (next < 0) next = 0;
    if (next > item.stockKg) next = item.stockKg;
    onUpdateQuantity(item.id, next);
  };

  return (
    <section
      id="panel-produce"
      aria-labelledby="produce-heading"
      className="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-xs flex flex-col h-full overflow-hidden transition-colors duration-200"
    >
      {/* Panel Header */}
      <div className="p-5 sm:p-6 border-b border-stone-200 dark:border-slate-800 bg-stone-50/70 dark:bg-slate-900/90">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h2 id="produce-heading" className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white tracking-tight">
                Browse & Buy Farm Produce
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-400 mt-1">
              Direct farmer-listed grains, root crops & fresh vegetables at wholesale-transparent rates.
            </p>
          </div>

          {/* Header Action & Unit Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            {onOpenRaiseDemand && (
              <button
                type="button"
                id="btn-raise-demand-open"
                onClick={onOpenRaiseDemand}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                title="Post a demand for produce you need from farmers"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Demand Produce (मांग दर्ज करें)</span>
              </button>
            )}

            {/* Unit Toggle */}
            <div className="flex items-center bg-stone-200/80 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-medium border border-stone-300 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setPriceUnitView('kg')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  priceUnitView === 'kg'
                    ? 'bg-white dark:bg-emerald-700 text-emerald-800 dark:text-white shadow-xs font-semibold'
                    : 'text-stone-600 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                Per kg
              </button>
              <button
                type="button"
                onClick={() => setPriceUnitView('quintal')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  priceUnitView === 'quintal'
                    ? 'bg-white dark:bg-emerald-700 text-emerald-800 dark:text-white shadow-xs font-semibold'
                    : 'text-stone-600 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                Per Quintal (100kg)
              </button>
            </div>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="search-produce-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wheat, rice, potato, onion, farmer, or region..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all placeholder:text-stone-400 dark:placeholder-slate-500 text-stone-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                    : 'bg-white dark:bg-slate-800 text-stone-600 dark:text-slate-300 border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-700 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Produce Items Scrollable List */}
      <div className="p-4 sm:p-6 flex-1 overflow-y-auto max-h-[600px] space-y-3.5 divide-y divide-stone-100 dark:divide-slate-800">
        {filteredProduce.length === 0 ? (
          <div className="py-12 text-center text-stone-500 dark:text-slate-400">
            <p className="text-sm font-medium">No produce items found matching &quot;{searchQuery}&quot;</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredProduce.map((item) => {
            const quantity = cartQuantities[item.id] || 0;
            const itemSubtotal = quantity * item.pricePerKg;
            const isSelected = quantity > 0;

            return (
              <article
                key={item.id}
                className={`pt-3.5 first:pt-0 rounded-xl transition-all ${
                  isSelected 
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/30 p-3 border border-emerald-200/60 dark:border-emerald-700/50' 
                    : 'p-1 hover:bg-stone-50/50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white">
                        {item.name}
                      </h3>
                      {item.hindiName && (
                        <span className="text-xs text-stone-500 dark:text-slate-400 font-normal">
                          ({item.hindiName})
                        </span>
                      )}
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700">
                        {item.category}
                      </span>
                      {item.organic && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          Organic
                        </span>
                      )}
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50 flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        {item.qualityGrade}
                      </span>
                      {(item.variety.includes('Direct Farm Gate') || item.farmerName.includes('👨‍🌾') || item.id.startsWith('prod-farm-')) && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700/60 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          Direct Farm Harvest (सीधा किसान से)
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 dark:text-slate-400 mt-1 line-clamp-1">
                      {item.variety} • <span className="text-stone-500 dark:text-slate-400">{item.description}</span>
                    </p>

                    {/* Farmer & Harvest details */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-stone-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 text-stone-700 dark:text-slate-300 font-medium">
                        👨‍🌾 {item.farmerName}
                      </span>
                      <span className="flex items-center gap-1 text-stone-500 dark:text-slate-400">
                        <MapPin className="w-3 h-3 text-stone-400 dark:text-slate-500" />
                        {item.location} ({item.distanceKm} km)
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                        <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        {item.harvestedDate}
                      </span>
                      <span className="text-stone-400 dark:text-slate-500">
                        Stock: {item.stockKg.toLocaleString()} kg
                      </span>
                    </div>
                  </div>

                  {/* Right: Pricing & Quantity Entry */}
                  <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-slate-800">
                    {/* Price Display */}
                    <div className="text-left sm:text-right">
                      {priceUnitView === 'kg' ? (
                        <div>
                          <div className="text-base font-bold text-stone-900 dark:text-white font-mono">
                            ₹{item.pricePerKg}
                            <span className="text-xs font-normal text-stone-500 dark:text-slate-400"> / kg</span>
                          </div>
                          <div className="text-[10px] text-stone-400 dark:text-slate-500">
                            (₹{item.pricePerQuintal.toLocaleString()} / quintal)
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-base font-bold text-stone-900 dark:text-white font-mono">
                            ₹{item.pricePerQuintal.toLocaleString()}
                            <span className="text-xs font-normal text-stone-500 dark:text-slate-400"> / qtl</span>
                          </div>
                          <div className="text-[10px] text-stone-400 dark:text-slate-500">
                            (₹{item.pricePerKg} / kg)
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Interactive Quantity Stepper & Live Calculation */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-stone-100 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-600">
                        <button
                          type="button"
                          onClick={() => handleStep(item, -1)}
                          disabled={quantity <= 0}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="px-2.5 py-1.5 text-stone-600 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <div className="relative">
                          <input
                            type="number"
                            id={`qty-${item.id}`}
                            aria-label={`Buy quantity for ${item.name} in kilograms`}
                            min="0"
                            max={item.stockKg}
                            step={item.minOrderKg >= 5 ? '5' : '1'}
                            value={quantity === 0 ? '' : quantity}
                            onChange={(e) => handleInputChange(item, e.target.value)}
                            placeholder="0"
                            className="w-14 text-center text-xs sm:text-sm font-semibold text-stone-900 dark:text-white bg-transparent py-1.5 focus:outline-none font-mono"
                          />
                          <span className="text-[10px] text-stone-400 dark:text-slate-400 font-mono -ml-1 pr-1.5 select-none">
                            kg
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleStep(item, 1)}
                          disabled={quantity >= item.stockKg}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="px-2.5 py-1.5 text-stone-600 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Live Calculated Subtotal for this Item */}
                      <div className="w-20 text-right">
                        <span className="text-[10px] block text-stone-400 dark:text-slate-500 uppercase tracking-wider">
                          Subtotal
                        </span>
                        <span
                          className={`text-xs sm:text-sm font-bold font-mono ${
                            itemSubtotal > 0 ? 'text-emerald-800 dark:text-emerald-400' : 'text-stone-400 dark:text-slate-500'
                          }`}
                        >
                          ₹{itemSubtotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Panel Footer: Live Running Total & Proceed to Order */}
      <div className="p-4 sm:p-5 border-t border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900/95">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-600 dark:text-slate-300 font-medium">
                Selected: <strong className="text-stone-900 dark:text-white">{cartItemCount} items</strong>
              </span>
              <span className="text-xs text-stone-400 dark:text-slate-500">•</span>
              <span className="text-xs text-stone-600 dark:text-slate-300 font-medium flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-stone-500 dark:text-slate-400" />
                Total Weight: <strong className="text-stone-900 dark:text-white">{totalWeightKg.toFixed(1)} kg</strong>
              </span>
            </div>

            {bulkDiscountAmount > 0 && (
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 dark:text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Bulk Tier Applied: Saved ₹{bulkDiscountAmount.toLocaleString()} (Direct Cooperative Rebate)
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 justify-end">
            {cartItemCount > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs text-stone-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-lg hover:bg-stone-200/60 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                title="Reset all quantities"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}

            <div className="text-right mr-1">
              <span className="text-[11px] text-stone-500 dark:text-slate-400 block">Subtotal</span>
              <span className="text-lg font-bold text-stone-900 dark:text-white font-mono leading-none">
                ₹{finalCartAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="button"
              id="proceed-to-order-btn"
              disabled={cartItemCount === 0}
              onClick={onProceedToOrder}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${
                cartItemCount > 0
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer active:scale-98 shadow-emerald-900/20'
                  : 'bg-stone-200 dark:bg-slate-800 text-stone-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Proceed to Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
