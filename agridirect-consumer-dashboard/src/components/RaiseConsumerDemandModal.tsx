import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Tag, 
  DollarSign, 
  Scale, 
  AlertCircle,
  Sparkles,
  Users
} from 'lucide-react';
import { marketplaceService, BuyerDemand } from '../../../src/services/marketplaceService';

interface RaiseConsumerDemandModalProps {
  isOpen: boolean;
  onClose: () => void;
  consumerName?: string;
  consumerId?: string;
  onSuccess?: (newDemand: BuyerDemand) => void;
}

export const RaiseConsumerDemandModal: React.FC<RaiseConsumerDemandModalProps> = ({
  isOpen,
  onClose,
  consumerName = 'Priya Sharma',
  consumerId = 'usr_cons_001',
  onSuccess
}) => {
  const [commodity, setCommodity] = useState('Organic Farm Tomatoes (देशी टमाटर)');
  const [category, setCategory] = useState<'Grains' | 'Vegetables' | 'Pulses & Seeds' | 'Fruits' | 'Oilseeds'>('Vegetables');
  const [variety, setVariety] = useState('Country Desi / Naturally Ripened');
  const [requiredQty, setRequiredQty] = useState<number>(50);
  const [offeredPrice, setOfferedPrice] = useState<number>(30); // ₹30/kg
  const [deliveryLocation, setDeliveryLocation] = useState('Sector 45 Community Gate, Gurugram, Haryana');
  const [neededByDate, setNeededByDate] = useState(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [organization, setOrganization] = useState('Green Valley Residents Society');
  const [notes, setNotes] = useState('Looking for fresh harvest, direct from farm gate without cold storage chemicals.');
  const [paymentTerms, setPaymentTerms] = useState('Instant UPI / Card payment on doorstep weighbridge delivery');

  const [submittedToast, setSubmittedToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commodity.trim()) {
      setErrorMsg('Please enter produce or commodity name.');
      return;
    }
    if (requiredQty <= 0) {
      setErrorMsg('Required quantity must be greater than zero.');
      return;
    }
    if (offeredPrice <= 0) {
      setErrorMsg('Offered price must be greater than zero.');
      return;
    }

    const created = marketplaceService.raiseDemand({
      buyerId: consumerId,
      buyerName: consumerName,
      buyerType: 'consumer',
      organization: organization.trim() || undefined,
      commodity: commodity.trim(),
      category,
      variety: variety.trim() || undefined,
      requiredQty: Number(requiredQty),
      unit: 'kg',
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
        className="bg-white dark:bg-slate-900 border border-blue-500/30 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden text-slate-900 dark:text-slate-100"
        role="dialog"
        aria-labelledby="demand-title"
      >
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 id="demand-title" className="text-base sm:text-lg font-bold">
                Raise Produce Demand (किसानों से सीधी मांग)
              </h3>
              <p className="text-[11px] text-blue-100">
                Broadcast your produce requirements directly to local and state farmers
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
            <div className="p-3 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 animate-bounce shadow-lg">
              <CheckCircle2 className="w-5 h-5" />
              <span>Demand Broadcasted! Local farmers can now view and fulfill your request.</span>
            </div>
          )}

          {/* Commodity & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Produce Name (क्या चाहिए?) *
              </label>
              <input
                type="text"
                value={commodity}
                onChange={(e) => setCommodity(e.target.value)}
                placeholder="e.g. Desi Wheat, Organic Tomato"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
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
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              >
                <option value="Vegetables">Vegetables (सब्जियां)</option>
                <option value="Grains">Grains & Cereals (अनाज)</option>
                <option value="Pulses & Seeds">Pulses (दालें)</option>
                <option value="Fruits">Fruits (फल)</option>
              </select>
            </div>
          </div>

          {/* Quantity & Target Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/60">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Quantity Needed (मात्रा) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={requiredQty}
                  onChange={(e) => setRequiredQty(parseFloat(e.target.value) || 0)}
                  className="w-full pl-3 pr-10 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-bold focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  required
                />
                <span className="absolute right-3 top-2 text-xs text-slate-500 font-semibold">
                  Kg
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Price (आप कितना भुगतान करेंगे?) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-12 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-bold text-blue-700 dark:text-blue-400 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <span className="absolute right-3 top-2 text-xs text-slate-500 font-semibold">
                  / kg
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Location & Needed Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Delivery Address / Community Gate *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="e.g. Sector 45, Gurugram"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Needed By Date (तारीख)
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="date"
                  value={neededByDate}
                  onChange={(e) => setNeededByDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Buyer/Society Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Society / Group / Buyer Name (सोसायटी या खरीदार का नाम)
            </label>
            <div className="relative">
              <Users className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Green Valley Residents Welfare Society"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Special Preferences (विशेष मांग)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Naturally grown, medium size, unwashed preferred"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
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
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md hover:shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Broadcast Demand to Farmers (मांग भेजें)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
