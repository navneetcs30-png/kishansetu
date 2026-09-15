import React from 'react';
import { ShoppingBag, ShoppingCart, ArrowRight, ShieldCheck, Sparkles, Sprout } from 'lucide-react';

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
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-stone-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      {/* Illustrative Notice & Perspective Banner */}
      <div className="bg-stone-900 dark:bg-slate-950 text-stone-300 dark:text-slate-400 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded text-[11px] border border-amber-500/20">
            <Sparkles className="w-3 h-3" />
            Buyer Portal
          </span>
          <span className="hidden sm:inline text-stone-500">|</span>
          <span className="text-stone-300 dark:text-slate-300">
            Consumer Marketplace: Connecting households directly to verified farmer cooperatives.
          </span>
        </div>
        <div className="flex items-center gap-2 text-stone-400 dark:text-slate-400 text-[11px]">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Indicative Mandi Rates • Sample Illustrative Data</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand & Portal Type */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
            <Sprout className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white flex items-center gap-1.5">
                AgriDirect <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full">Consumer Hub</span>
              </h1>
            </div>
            <p className="text-xs text-stone-500 dark:text-slate-400 hidden sm:block">
              Farm-to-Kitchen Direct Grains, Pulses & Vegetables
            </p>
          </div>
        </div>

        {/* Desktop Quick Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-stone-100 dark:bg-slate-950/70 p-1 rounded-xl text-xs font-medium text-stone-600 dark:text-slate-300 border border-stone-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onNavigate('panel-produce')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'panel-produce'
                ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-xs font-semibold'
                : 'hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-slate-800/60'
            }`}
          >
            Browse & Buy
          </button>
          <button
            type="button"
            onClick={() => onNavigate('panel-orders')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'panel-orders'
                ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-xs font-semibold'
                : 'hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-slate-800/60'
            }`}
          >
            My Orders
          </button>
          <button
            type="button"
            onClick={() => onNavigate('panel-guidance')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'panel-guidance'
                ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-xs font-semibold'
                : 'hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-slate-800/60'
            }`}
          >
            Storage Guidance
          </button>
          <button
            type="button"
            onClick={() => onNavigate('panel-offers')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'panel-offers'
                ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-xs font-semibold'
                : 'hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-slate-800/60'
            }`}
          >
            Offers & Schemes
          </button>
        </nav>

        {/* Running Live Cart Total Widget */}
        <div className="flex items-center gap-3">
          <div
            id="running-cart-widget"
            className="flex items-center gap-3 bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl px-3 py-1.5 shadow-xs transition-all"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center relative shadow-xs">
              <ShoppingCart className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-stone-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-slate-900">
                  {cartItemCount}
                </span>
              )}
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                  Live Cart Total
                </span>
                {totalWeightKg > 0 && (
                  <span className="text-[10px] bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 px-1.5 py-0.2 rounded font-mono font-medium">
                    {totalWeightKg.toFixed(1)} kg
                  </span>
                )}
              </div>
              <div className="text-sm sm:text-base font-bold text-stone-900 dark:text-white font-mono tracking-tight leading-none mt-0.5">
                ₹{totalCartAmount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <button
            type="button"
            id="header-checkout-btn"
            disabled={cartItemCount === 0}
            onClick={onProceedToOrder}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${
              cartItemCount > 0
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-95 cursor-pointer shadow-emerald-900/20'
                : 'bg-stone-200 dark:bg-slate-800 text-stone-400 dark:text-slate-500 cursor-not-allowed'
            }`}
            title={cartItemCount > 0 ? 'Proceed with current cart' : 'Add items to cart first'}
          >
            <span className="hidden sm:inline">Proceed to Order</span>
            <span className="sm:hidden">Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
