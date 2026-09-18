import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  CheckCircle2, 
  MapPin, 
  Tag, 
  Scale, 
  Layers, 
  AlertCircle, 
  ShoppingBag, 
  Building2,
  PackageCheck
} from 'lucide-react';
import { marketplaceService, FarmerProduct } from '../../../src/services/marketplaceService';

interface FarmerMyListingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmerId?: string;
  onOpenSubmitNew?: () => void;
}

export const FarmerMyListingsModal: React.FC<FarmerMyListingsModalProps> = ({
  isOpen,
  onClose,
  farmerId = 'sub-farmer-01',
  onOpenSubmitNew
}) => {
  const [products, setProducts] = useState<FarmerProduct[]>([]);

  useEffect(() => {
    if (isOpen) {
      setProducts(marketplaceService.getProductsByFarmer(farmerId));
    }
  }, [isOpen, farmerId]);

  if (!isOpen) return null;

  const handleDelete = (id: string) => {
    marketplaceService.deleteProduct(id);
    setProducts(marketplaceService.getProductsByFarmer(farmerId));
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    marketplaceService.updateProductStatus(id, currentStatus === 'active' ? 'sold_out' : 'active');
    setProducts(marketplaceService.getProductsByFarmer(farmerId));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
        role="dialog"
        aria-labelledby="listings-title"
      >
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5" />
            <div>
              <h3 id="listings-title" className="font-bold text-base sm:text-lg">
                My Listed Produce (मेरी दर्ज फसलें)
              </h3>
              <p className="text-xs text-emerald-100">
                Manage your active farm inventory visible to Buyers
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

        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1 text-xs sm:text-sm">
          {products.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">You have no active produce listings.</p>
              <p className="text-xs text-slate-500 mt-1">Submit your crops to start receiving direct orders.</p>
              {onOpenSubmitNew && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSubmitNew();
                  }}
                  className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>+ Submit Produce for Sale</span>
                </button>
              )}
            </div>
          ) : (
            products.map((item) => (
              <div 
                key={item.id}
                className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {item.status === 'active' ? 'Active' : 'Sold Out'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.category} • {item.variety} • {item.qualityGrade}
                    </p>
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-1">
                      ₹{item.pricePerQuintal.toLocaleString()}/Qtl (₹{item.pricePerKg}/kg) • Stock: {item.availableStockQuintals} Qtl
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(item.id, item.status)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                  >
                    {item.status === 'active' ? 'Mark Sold Out' : 'Mark Active'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                    title="Delete Listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Total {products.length} listing(s) published
          </span>
          {onOpenSubmitNew && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSubmitNew();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              + Submit Another Crop
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
