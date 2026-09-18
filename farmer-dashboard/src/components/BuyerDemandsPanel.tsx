import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShoppingBag, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  DollarSign, 
  Scale, 
  ArrowRight, 
  Sparkles, 
  Filter, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  X,
  AlertCircle,
  Handshake,
  FileCheck2
} from 'lucide-react';
import { marketplaceService, BuyerDemand } from '../../../src/services/marketplaceService';

interface BuyerDemandsPanelProps {
  farmerName?: string;
  farmerId?: string;
  onOpenSubmitProduct?: () => void;
}

export const BuyerDemandsPanel: React.FC<BuyerDemandsPanelProps> = ({
  farmerName = 'Ramesh Patel',
  farmerId = 'sub-farmer-01',
  onOpenSubmitProduct,
}) => {
  const [demands, setDemands] = useState<BuyerDemand[]>(() => marketplaceService.getDemands());
  const [filterType, setFilterType] = useState<'all' | 'bulk_buyer' | 'consumer'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  
  // Fulfillment Modal State
  const [selectedDemand, setSelectedDemand] = useState<BuyerDemand | null>(null);
  const [committedQty, setCommittedQty] = useState<number>(50);
  const [committedRate, setCommittedRate] = useState<number>(0);
  const [dispatchDate, setDispatchDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [fulfillSuccessToast, setFulfillSuccessToast] = useState(false);

  useEffect(() => {
    const update = () => {
      setDemands(marketplaceService.getDemands());
    };
    const unsubscribe = marketplaceService.subscribe(update);
    window.addEventListener('kishansetu_demands_updated', update);
    return () => {
      unsubscribe();
      window.removeEventListener('kishansetu_demands_updated', update);
    };
  }, []);

  const filteredDemands = demands.filter((d) => {
    const matchesType = filterType === 'all' || d.buyerType === filterType;
    const matchesCategory = filterCategory === 'All' || d.category === filterCategory;
    return matchesType && matchesCategory;
  });

  const openFulfillmentModal = (demand: BuyerDemand) => {
    setSelectedDemand(demand);
    setCommittedQty(Math.min(demand.requiredQty, demand.unit === 'quintal' ? 50 : 100));
    setCommittedRate(demand.offeredPrice);
  };

  const handleConfirmFulfillment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDemand) return;

    marketplaceService.fulfillDemand(selectedDemand.id, {
      farmerId,
      farmerName,
      committedQty,
      committedRate: committedRate || selectedDemand.offeredPrice
    });

    setFulfillSuccessToast(true);
    setTimeout(() => {
      setFulfillSuccessToast(false);
      setSelectedDemand(null);
    }, 1200);
  };

  const bulkCount = demands.filter((d) => d.buyerType === 'bulk_buyer' && d.status === 'open').length;
  const consumerCount = demands.filter((d) => d.buyerType === 'consumer' && d.status === 'open').length;

  return (
    <section 
      id="panel-buyer-demands"
      aria-labelledby="demands-panel-title"
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col overflow-hidden transition-colors duration-200"
    >
      {/* Panel Header */}
      <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <h2 id="demands-panel-title" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Live Buyer Demands & Procurement Requisitions
              </h2>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                {demands.filter(d => d.status === 'open').length} Active Demands
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Direct purchase requests raised by Consumers and B2B Bulk Buyers. Commit your supply to secure guaranteed buyers with verified payment terms.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenSubmitProduct && (
              <button
                type="button"
                onClick={onOpenSubmitProduct}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>+ List My Produce</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Demands ({demands.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('bulk_buyer')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterType === 'bulk_buyer'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>B2B Bulk ({bulkCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterType('consumer')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterType === 'consumer'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Consumers ({consumerCount})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All Categories</option>
              <option value="Grains">Grains (अनाज)</option>
              <option value="Vegetables">Vegetables (सब्जियां)</option>
              <option value="Oilseeds">Oilseeds (तिलहन)</option>
              <option value="Pulses & Seeds">Pulses (दालें)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Demands Cards List */}
      <div className="p-4 sm:p-6 space-y-4 flex-1">
        {filteredDemands.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No demands match the selected filter.</p>
            <p className="text-xs text-slate-500 mt-1">Check back soon or view all categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredDemands.map((demand) => {
              const isBulk = demand.buyerType === 'bulk_buyer';
              const isFulfilled = demand.status === 'fulfilled';

              return (
                <div
                  key={demand.id}
                  className={`rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 relative ${
                    isFulfilled
                      ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80'
                      : isBulk
                      ? 'bg-white dark:bg-slate-900 border-amber-300/70 dark:border-amber-700/60 shadow-xs hover:shadow-md'
                      : 'bg-white dark:bg-slate-900 border-blue-300/70 dark:border-blue-700/60 shadow-xs hover:shadow-md'
                  }`}
                >
                  {/* Card Header & Buyer Tag */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 ${
                          isBulk ? 'bg-amber-600' : 'bg-blue-600'
                        }`}>
                          {isBulk ? <Building2 className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm leading-tight">
                            {demand.organization || demand.buyerName}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <span>{demand.buyerName}</span> • 
                            <span className={isBulk ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-blue-600 dark:text-blue-400 font-semibold'}>
                              {isBulk ? 'B2B Institutional Buyer' : 'Direct Consumer Co-op'}
                            </span>
                          </p>
                        </div>
                      </div>

                      {isFulfilled ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Fulfilled</span>
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          isBulk
                            ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                            : 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                        }`}>
                          Open Demand
                        </span>
                      )}
                    </div>

                    {/* Commodity & Key Specs */}
                    <div className="my-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60">
                      <div className="flex items-baseline justify-between gap-2">
                        <div>
                          <p className="text-[11px] text-slate-500 uppercase font-semibold">Commodity Required</p>
                          <p className="text-sm font-extrabold text-slate-900 dark:text-white">{demand.commodity}</p>
                          {demand.variety && (
                            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">{demand.variety}</p>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-[11px] text-slate-500 uppercase font-semibold">Offered Price</p>
                          <p className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                            ₹{demand.offeredPrice.toLocaleString('en-IN')}
                            <span className="text-xs font-semibold text-slate-500"> / {demand.unit === 'quintal' ? 'Qtl' : 'kg'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/70 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Required Volume:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {demand.requiredQty.toLocaleString('en-IN')} {demand.unit === 'quintal' ? 'Quintals (Q)' : 'Kg'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Needed By:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {demand.neededByDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery & Payment Assurance */}
                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{demand.deliveryLocation}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                          {demand.paymentTerms}
                        </span>
                      </div>
                      {demand.notes && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-1 line-clamp-2">
                          "{demand.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                    {isFulfilled ? (
                      <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                        <Handshake className="w-4 h-4" />
                        <span>Supply Committed by {demand.fulfilledByFarmerName} ({demand.committedQty} {demand.unit})</span>
                      </div>
                    ) : (
                      <>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Direct Mandi Settlement Available
                        </span>
                        <button
                          type="button"
                          onClick={() => openFulfillmentModal(demand)}
                          className={`px-4 py-2 rounded-xl text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
                            isBulk
                              ? 'bg-amber-600 hover:bg-amber-500 hover:shadow-amber-500/20'
                              : 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/20'
                          }`}
                        >
                          <Handshake className="w-3.5 h-3.5" />
                          <span>Fulfill Supply (आपूर्ति दें)</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fulfillment Modal */}
      {selectedDemand && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div 
            className="bg-white dark:bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-6 overflow-hidden text-slate-900 dark:text-slate-100"
            role="dialog"
            aria-labelledby="fulfill-title"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Handshake className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="fulfill-title" className="font-bold text-base text-slate-900 dark:text-white">
                    Commit Harvest Supply (आपूर्ति प्रतिबद्धता)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Demand for {selectedDemand.commodity} from {selectedDemand.organization || selectedDemand.buyerName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDemand(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {fulfillSuccessToast ? (
              <div className="p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-base text-emerald-700 dark:text-emerald-400">Supply Commitment Recorded!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Buyer has been notified. The contract token has been generated for direct mandi settlement.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmFulfillment} className="space-y-4 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Buyer Target Offer:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{selectedDemand.offeredPrice} / {selectedDemand.unit === 'quintal' ? 'Qtl' : 'kg'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs mt-1">
                    <span className="text-slate-500">Total Needed by Buyer:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedDemand.requiredQty} {selectedDemand.unit}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    How much quantity can you supply? (आप कितनी मात्रा दे सकते हैं?) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={committedQty}
                      onChange={(e) => setCommittedQty(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                      required
                    />
                    <span className="absolute right-3 top-2 text-xs font-semibold text-slate-400">
                      {selectedDemand.unit}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Confirmed Supply Price (आपकी दर ₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min="1"
                      value={committedRate}
                      onChange={(e) => setCommittedRate(parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-emerald-700 dark:text-emerald-400 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Dispatch / Harvest Availability Date
                  </label>
                  <input
                    type="date"
                    value={dispatchDate}
                    onChange={(e) => setDispatchDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span>
                    Total Contract Value: <strong>₹{(committedQty * committedRate).toLocaleString('en-IN')}</strong>. 
                    Protected by KishanSetu APMC escrow and Direct Bank Transfer.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedDemand(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Commitment</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
