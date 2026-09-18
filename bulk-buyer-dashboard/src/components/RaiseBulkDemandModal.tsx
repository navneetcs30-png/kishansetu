import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Tag, 
  DollarSign, 
  Scale, 
  AlertCircle,
  FileSpreadsheet,
  Warehouse,
  ShieldCheck
} from 'lucide-react';
import { marketplaceService, BuyerDemand } from '../../../src/services/marketplaceService';

interface RaiseBulkDemandModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyerName?: string;
  buyerId?: string;
  organization?: string;
  onSuccess?: (newDemand: BuyerDemand) => void;
}

export const RaiseBulkDemandModal: React.FC<RaiseBulkDemandModalProps> = ({
  isOpen,
  onClose,
  buyerName = 'Vikram Singhania',
  buyerId = 'usr_bulk_001',
  organization = 'Singhania Roller Flour & Agro Mills Ltd.',
  onSuccess
}) => {
  const [commodity, setCommodity] = useState('Sharbati Golden Wheat (शरबती गेहूं)');
  const [category, setCategory] = useState<'Grains' | 'Vegetables' | 'Pulses & Seeds' | 'Fruits' | 'Oilseeds'>('Grains');
  const [variety, setVariety] = useState('C-306 / Lokwan High-Protein');
  const [requiredQuintals, setRequiredQuintals] = useState<number>(500);
  const [offeredPrice, setOfferedPrice] = useState<number>(2520); // ₹2,520 / Quintal
  const [deliveryLocation, setDeliveryLocation] = useState('Central Silo Complex, Pithampur Industrial Corridor, MP');
  const [neededByDate, setNeededByDate] = useState(
    new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [companyName, setCompanyName] = useState(organization);
  const [paymentTerms, setPaymentTerms] = useState('100% RTGS Direct Bank Transfer within 48h of weighbridge certification');
  const [notes, setNotes] = useState('Moisture content must be below 12%, Sortex clean 99.5%. Farm gate truck pickup provided for lots exceeding 200 Quintals.');

  const [submittedToast, setSubmittedToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const totalContractValue = requiredQuintals * offeredPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commodity.trim()) {
      setErrorMsg('Please enter commodity name.');
      return;
    }
    if (requiredQuintals <= 0) {
      setErrorMsg('Required volume must be greater than zero.');
      return;
    }
    if (offeredPrice <= 0) {
      setErrorMsg('Offered price must be greater than zero.');
      return;
    }

    const created = marketplaceService.raiseDemand({
      buyerId,
      buyerName,
      buyerType: 'bulk_buyer',
      organization: companyName.trim() || organization,
      commodity: commodity.trim(),
      category,
      variety: variety.trim() || undefined,
      requiredQty: Number(requiredQuintals),
      unit: 'quintal',
      offeredPrice: Number(offeredPrice),
      deliveryLocation: deliveryLocation.trim(),
      neededByDate,
      paymentTerms,
      notes: notes.trim() || undefined,
    });

    setSubmittedToast(true);
    onSuccess?.(created);

    setTimeout(() => {
      setSubmittedToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden text-slate-900 dark:text-slate-100"
        role="dialog"
        aria-labelledby="bulk-demand-title"
      >
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-800 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 id="bulk-demand-title" className="text-base sm:text-lg font-bold">
                Post Institutional Procurement RFQ (थोक मांग दर्ज करें)
              </h3>
              <p className="text-[11px] text-amber-100">
                Broadcast commercial requirement to regional farmers and FPO clusters
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {submittedToast && (
            <div className="p-3 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center gap-2 animate-bounce shadow-lg">
              <CheckCircle2 className="w-5 h-5" />
              <span>Procurement RFQ Published! Farmers are being notified in real-time.</span>
            </div>
          )}

          {/* Buyer Organization & Commodity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Buying Company / Mill Name *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category (श्रेणी)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
              >
                <option value="Grains">Grains & Cereals (अनाज)</option>
                <option value="Vegetables">Vegetables & Tubers (सब्जियां)</option>
                <option value="Oilseeds">Oilseeds & Mustard (तिलहन)</option>
                <option value="Pulses & Seeds">Pulses & Legumes (दालें)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Commodity Name (फसल / सामग्री) *
              </label>
              <input
                type="text"
                value={commodity}
                onChange={(e) => setCommodity(e.target.value)}
                placeholder="e.g. Sharbati Wheat, Pusa 1121"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Variety / Grade Specs
              </label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g. Lokwan Grade A, Moisture < 12%"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Volume & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Required Volume (मात्रा) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={requiredQuintals}
                  onChange={(e) => setRequiredQuintals(parseFloat(e.target.value) || 0)}
                  className="w-full pl-3 pr-16 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-bold focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
                  required
                />
                <span className="absolute right-3 top-2 text-xs text-slate-500 font-semibold">
                  Quintals
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">(= {(requiredQuintals * 100).toLocaleString()} kg / {(requiredQuintals / 10).toFixed(1)} MT)</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Offered Price per Quintal (प्रस्तावित भाव) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min="100"
                  step="10"
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-14 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-bold text-amber-700 dark:text-amber-400 focus:ring-2 focus:ring-amber-500"
                  required
                />
                <span className="absolute right-3 top-2 text-xs text-slate-500 font-semibold">
                  / Qtl
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">(= ₹{(offeredPrice / 100).toFixed(1)}/kg equivalent)</p>
            </div>
          </div>

          {/* Delivery Location & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Receiving Mandi / Silo Warehouse *
              </label>
              <div className="relative">
                <Warehouse className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="e.g. Silo Depot, Pithampur"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Required Delivery Timeline *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="date"
                  value={neededByDate}
                  onChange={(e) => setNeededByDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Terms & Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Terms & Settlement Assurance
            </label>
            <input
              type="text"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Quality Specs & Logistics Instructions
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Total Value Summary */}
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center justify-between text-emerald-900 dark:text-emerald-200">
            <span className="font-medium">Total Procurement Value:</span>
            <span className="font-extrabold text-sm text-emerald-700 dark:text-emerald-400 font-mono">
              ₹{totalContractValue.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md hover:shadow-amber-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Broadcast RFQ to Farmers (मांग पोस्ट करें)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
