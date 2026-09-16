import React from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../../src/i18n/LanguageContext';

interface HeaderProps {
  totalCartAmount: number;
  totalWeightKg: number;
  cartItemCount: number;
  onProceedToOrder: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalCartAmount,
  totalWeightKg,
  cartItemCount,
  onProceedToOrder,
  activeSection,
  onNavigate
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 border-b border-stone-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Context Title & Quick Nav Links */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white tracking-tight">
              {t('consumer.toolbarTitle', 'AgriDirect Consumer Store')}
            </h2>
          </div>

          {/* Desktop Quick Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100 dark:bg-slate-950/70 p-1 rounded-xl text-xs font-medium text-stone-600 dark:text-slate-300 border border-stone-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => onNavigate('panel-produce')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeSection === 'panel-produce'
                  ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-xs font-semibold'
                  : 'hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-slate-800/60'
              }`}
            >
              {t('consumer.browseProduce', 'Browse & Buy')}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('panel-orders')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeSection === 'panel-orders'
                  ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-xs font-semibold'
                  : 'hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-slate-800/60'
              }`}
            >
              {t('consumer.myOrders', 'My Orders')}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('panel-guidance')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeSection === 'panel-guidance'
                  ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-xs font-semibold'
                  : 'hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-slate-800/60'
              }`}
            >
              {t('consumer.guidance', 'Storage Guidance')}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('panel-offers')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeSection === 'panel-offers'
                  ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-xs font-semibold'
                  : 'hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-slate-800/60'
              }`}
            >
              {t('consumer.schemes', 'Offers & Schemes')}
            </button>
          </nav>
        </div>

        {/* Running Live Cart Total Widget & Checkout Action */}
        <div className="flex items-center gap-3 ml-auto">
          <div
            id="running-cart-widget"
            className="flex items-center gap-2.5 bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl px-3 py-1.5 shadow-xs transition-all"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center relative shadow-xs">
              <ShoppingCart className="w-3.5 h-3.5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-stone-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-slate-900">
                  {cartItemCount}
                </span>
              )}
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                  {t('consumer.cartTotal', 'Live Cart Total')}
                </span>
                {totalWeightKg > 0 && (
                  <span className="text-[10px] bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 px-1 py-0.2 rounded font-mono font-medium">
                    {totalWeightKg.toFixed(1)} kg
                  </span>
                )}
              </div>
              <div className="text-sm font-bold text-stone-900 dark:text-white font-mono tracking-tight leading-none mt-0.5">
                ₹{totalCartAmount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <button
            type="button"
            id="header-checkout-btn"
            disabled={cartItemCount === 0}
            onClick={onProceedToOrder}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer ${
              cartItemCount > 0
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-95 shadow-emerald-900/20'
                : 'bg-stone-200 dark:bg-slate-800 text-stone-400 dark:text-slate-500 cursor-not-allowed'
            }`}
            title={cartItemCount > 0 ? 'Proceed with current cart' : 'Add items to cart first'}
          >
            <span>{t('consumer.checkout', 'Proceed to Order')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
