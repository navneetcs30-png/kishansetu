import React from 'react';
import { ShoppingBag, PackageCheck, BookOpen, Tag } from 'lucide-react';

interface MobileNavProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  activeOrdersCount: number;
  cartItemCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeSection,
  onNavigate,
  activeOrdersCount,
  cartItemCount
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg px-2 py-1.5 safe-area-inset-bottom">
      <nav className="grid grid-cols-4 gap-1" aria-label="Quick mobile navigation">
        <button
          type="button"
          onClick={() => onNavigate('panel-produce')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
            activeSection === 'panel-produce'
              ? 'text-emerald-700 font-semibold bg-emerald-50'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-stone-900 font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">Browse & Buy</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('panel-orders')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
            activeSection === 'panel-orders'
              ? 'text-emerald-700 font-semibold bg-emerald-50'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <div className="relative">
            <PackageCheck className="w-5 h-5" />
            {activeOrdersCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-emerald-600 text-white font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {activeOrdersCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-0.5 tracking-tight">My Orders</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('panel-guidance')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
            activeSection === 'panel-guidance'
              ? 'text-emerald-700 font-semibold bg-emerald-50'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[11px] mt-0.5 tracking-tight">Guidance</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('panel-offers')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
            activeSection === 'panel-offers'
              ? 'text-emerald-700 font-semibold bg-emerald-50'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Tag className="w-5 h-5" />
          <span className="text-[11px] mt-0.5 tracking-tight">Offers & Govt</span>
        </button>
      </nav>
    </div>
  );
};
