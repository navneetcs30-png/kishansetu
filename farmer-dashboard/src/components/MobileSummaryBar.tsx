import React from 'react';
import { Calculator, ArrowUp, RefreshCw } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface MobileSummaryBarProps {
  totalGrainValue: number;
  totalVegetableValue: number;
  onResetAll: () => void;
}

export const MobileSummaryBar: React.FC<MobileSummaryBarProps> = ({
  totalGrainValue,
  totalVegetableValue,
  onResetAll,
}) => {
  const grandTotal = totalGrainValue + totalVegetableValue;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="Mobile summary of estimated earnings"
      className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-2.5 px-4 shadow-lg md:hidden flex items-center justify-between gap-3 transition-colors"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center flex-shrink-0 border border-emerald-200/80 dark:border-emerald-800/60">
          <Calculator className="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block">
            Est. Total Earnings
          </span>
          <div className="text-base font-extrabold text-amber-700 dark:text-amber-400 leading-none">
            {formatINR(grandTotal)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {grandTotal > 0 && (
          <button
            type="button"
            onClick={onResetAll}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors"
            aria-label="Reset all entered crop and vegetable quantities"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          onClick={scrollToTop}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-800 dark:bg-emerald-700 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors"
          aria-label="Scroll back to top"
        >
          <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Top</span>
        </button>
      </div>
    </aside>
  );
};
