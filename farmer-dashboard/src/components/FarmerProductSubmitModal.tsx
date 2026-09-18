import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  Upload, 
  Sprout, 
  Sparkles, 
  Layers, 
  MapPin, 
  Calendar, 
  Tag, 
  DollarSign, 
  Scale, 
  ShieldCheck, 
  Users, 
  Building2, 
  ShoppingBag,
  AlertCircle
} from 'lucide-react';
import { marketplaceService, FarmerProduct } from '../../../src/services/marketplaceService';

interface FarmerProductSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmerName?: string;
  farmerId?: string;
  initialCropName?: string;
  initialCategory?: 'Grains' | 'Vegetables' | 'Pulses & Seeds' | 'Fruits' | 'Oilseeds';
  initialPricePerQuintal?: number;
  initialPricePerKg?: number;
  onSuccess?: (newProduct: FarmerProduct) => void;
}

const PRESET_CROP_IMAGES = [
  { name: 'Wheat (गेहूं)', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80', category: 'Grains' },
  { name: 'Basmati Rice (धान)', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80', category: 'Grains' },
  { name: 'Potato (आलू)', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80', category: 'Vegetables' },
  { name: 'Onion (प्याज)', url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80', category: 'Vegetables' },
  { name: 'Tomato (टमाटर)', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80', category: 'Vegetables' },
  { name: 'Mustard (सरसों)', url: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=800&auto=format&fit=crop&q=80', category: 'Oilseeds' },
  { name: 'Green Peas (हरी मटर)', url: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?w=800&auto=format&fit=crop&q=80', category: 'Vegetables' },
  { name: 'Chickpea / Gram (चना)', url: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e3?w=800&auto=format&fit=crop&q=80', category: 'Pulses & Seeds' }
];

export const FarmerProductSubmitModal: React.FC<FarmerProductSubmitModalProps> = ({
  isOpen,
  onClose,
  farmerName = 'Ramesh Patel',
  farmerId = 'sub-farmer-01',
  initialCropName,
  initialCategory,
  initialPricePerQuintal,
  initialPricePerKg,
  onSuccess
}) => {
  const [name, setName] = useState(initialCropName || 'Sharbati Wheat (शरबती गेहूं)');
  const [hindiName, setHindiName] = useState('शरबती गेहूं');
  const [category, setCategory] = useState<'Grains' | 'Vegetables' | 'Pulses & Seeds' | 'Fruits' | 'Oilseeds'>(
    initialCategory || 'Grains'
  );
  const [variety, setVariety] = useState('Grade A Desi Lokwan');
  const [availableQuintals, setAvailableQuintals] = useState<number>(30);
  const [pricePerQuintal, setPricePerQuintal] = useState<number>(initialPricePerQuintal || 2450);
  const [minOrderQuintals, setMinOrderQuintals] = useState<number>(2);
  const [location, setLocation] = useState('Indore Mandi Yard, MP');
  const [state, setState] = useState('Madhya Pradesh');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [qualityGrade, setQualityGrade] = useState<'Grade A+' | 'Grade A' | 'Organic Certified' | 'Agmark Premium'>('Grade A+');
  const [targetAudience, setTargetAudience] = useState<'both' | 'consumer' | 'bulk_buyer'>('both');
  const [organic, setOrganic] = useState(true);
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80'
  );
  const [description, setDescription] = useState(
    'Direct farm-gate fresh produce, sun-dried on clean threshing floor, 0% foreign impurities. Ready for immediate pickup or dispatch.'
  );

  const [submittedToast, setSubmittedToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Derived price per kg
  const pricePerKg = Math.round((pricePerQuintal / 100) * 10) / 10;
  const availableKg = availableQuintals * 100;
  const minOrderKg = minOrderQuintals * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please specify produce name.');
      return;
    }
    if (availableQuintals <= 0) {
      setErrorMsg('Available quantity must be greater than zero.');
      return;
    }
    if (pricePerQuintal <= 0) {
      setErrorMsg('Price must be greater than zero.');
      return;
    }

    const created = marketplaceService.submitProduct({
      farmerId,
      farmerName,
      farmerContact: '+91 98260 11422',
      name: name.trim(),
      hindiName: hindiName.trim() || undefined,
      category,
      variety: variety.trim() || 'Standard Harvest',
      pricePerKg: pricePerKg || 25,
      pricePerQuintal: Number(pricePerQuintal),
      availableStockKg: availableKg,
      availableStockQuintals: Number(availableQuintals),
      minOrderKg,
      minOrderQuintals: Number(minOrderQuintals),
      location: location.trim(),
      state: state.trim(),
      harvestDate,
      qualityGrade,
      targetAudience,
      imageUrl,
      description: description.trim(),
      organic
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
        className="bg-white dark:bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
        role="dialog"
        aria-labelledby="submit-modal-title"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h2 id="submit-modal-title" className="text-base sm:text-lg font-bold">
                List Produce for Sale (उत्पाद बिक्री हेतु दर्ज करें)
              </h2>
              <p className="text-[11px] sm:text-xs text-emerald-100">
                Directly visible to Consumers & B2B Bulk Buyers across India
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Toast Notification */}
          {submittedToast && (
            <div className="p-3 rounded-xl bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 animate-bounce shadow-lg">
              <CheckCircle className="w-5 h-5" />
              <span>Produce Published Successfully! Now visible to Consumers & Bulk Buyers.</span>
            </div>
          )}

          {/* Farmer Profile Badge */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                Farmer: {farmerName}
              </span>
              <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-1.5 py-0.5 rounded font-mono">
                Verified Seller
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Zero Middleman Commission (0%)
            </span>
          </div>

          {/* Produce Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Crop / Produce Name (फसल का नाम) *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sharbati Wheat, Desi Potato"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category (श्रेणी) *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              >
                <option value="Grains">🌾 Grains & Cereals (अनाज)</option>
                <option value="Vegetables">🥦 Fresh Vegetables (ताज़ा सब्ज़ियां)</option>
                <option value="Pulses & Seeds">🫘 Pulses & Legumes (दालें)</option>
                <option value="Oilseeds">🌻 Oilseeds (तिलहन / सरसों)</option>
                <option value="Fruits">🍎 Farm Fruits (फल)</option>
              </select>
            </div>
          </div>

          {/* Variety & Grade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Variety / Seed (किस्म / वैरायटी)
              </label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g. C-306, Pusa 1121, Chipsona"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Quality Grade (गुणवत्ता प्रमाणन)
              </label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              >
                <option value="Grade A+">⭐ Grade A+ (Premium Export Standard)</option>
                <option value="Grade A">✅ Grade A (High Quality Standard)</option>
                <option value="Organic Certified">🌿 Organic Certified (जैविक प्रमाणित)</option>
                <option value="Agmark Premium">🏅 Agmark Certified Mandi Grade</option>
              </select>
            </div>
          </div>

          {/* Quantity & Expected Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Stock Available *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={availableQuintals}
                  onChange={(e) => setAvailableQuintals(parseFloat(e.target.value) || 0)}
                  className="w-full pl-3 pr-16 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-bold"
                  required
                />
                <span className="absolute right-3 top-2 text-xs text-slate-500 font-semibold">
                  Quintals
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">(= {availableKg.toLocaleString()} kg)</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Asking Price (मांग मूल्य) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">₹</span>
                <input
                  type="number"
                  min="1"
                  step="10"
                  value={pricePerQuintal}
                  onChange={(e) => setPricePerQuintal(parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-16 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-bold text-emerald-700 dark:text-emerald-400"
                  required
                />
                <span className="absolute right-3 top-2 text-xs text-slate-500 font-semibold">
                  / Qtl
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">(= ₹{pricePerKg}/kg to consumers)</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Min Order Qty (MOQ)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={minOrderQuintals}
                  onChange={(e) => setMinOrderQuintals(parseFloat(e.target.value) || 1)}
                  className="w-full pl-3 pr-14 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-bold"
                />
                <span className="absolute right-3 top-2 text-xs text-slate-500 font-semibold">
                  Qtl
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">(= {minOrderKg} kg min)</p>
            </div>
          </div>

          {/* Target Audience: Who can buy this? */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Target Buyer Audience (यह उत्पाद किसे दिखेगा?) *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetAudience('both')}
                className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                  targetAudience === 'both'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/20'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />
                  <Building2 className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <span className="text-xs">Both Buyers</span>
                <span className="text-[10px] text-slate-500">Retail & Bulk</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetAudience('consumer')}
                className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                  targetAudience === 'consumer'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-800 dark:text-blue-300 font-bold ring-2 ring-blue-500/20'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-blue-500" />
                <span className="text-xs">Consumers Only</span>
                <span className="text-[10px] text-slate-500">Direct Retail</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetAudience('bulk_buyer')}
                className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                  targetAudience === 'bulk_buyer'
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-800 dark:text-amber-300 font-bold ring-2 ring-amber-500/20'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Building2 className="w-4 h-4 text-amber-500" />
                <span className="text-xs">Bulk Buyers Only</span>
                <span className="text-[10px] text-slate-500">Mills & Wholesalers</span>
              </button>
            </div>
          </div>

          {/* Location & Harvest Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Farm / Mandi Location (खेत या मंडी का पता) *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Sehore Mandi, MP"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Harvest Date / Ready By
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="date"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Image Presets Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Produce Image (फसल की तस्वीर चुनें)
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {PRESET_CROP_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`shrink-0 rounded-xl overflow-hidden border-2 transition relative p-0.5 cursor-pointer ${
                    imageUrl === preset.url ? 'border-emerald-500 ring-2 ring-emerald-400/40' : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                  title={preset.name}
                >
                  <img src={preset.url} alt={preset.name} className="w-14 h-11 object-cover rounded-lg" />
                  <span className="text-[9px] block text-center truncate max-w-[60px] text-slate-700 dark:text-slate-300 mt-0.5">
                    {preset.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Description & Organic Checkbox */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description & Quality Notes (गुणवत्ता विवरण)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={organic}
              onChange={(e) => setOrganic(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              🌿 Grown using organic practices / zero harmful pesticide residue
            </span>
          </label>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md hover:shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Publish to Marketplace (बाज़ार में लाइव करें)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
