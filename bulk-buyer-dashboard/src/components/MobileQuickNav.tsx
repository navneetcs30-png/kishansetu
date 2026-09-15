import React, { useEffect, useState } from 'react';
import { ShoppingBag, FileText, BookOpen, Landmark } from 'lucide-react';

interface MobileQuickNavProps {
  selectedItemsCount: number;
  actionRequiredCount: number;
}

export const MobileQuickNav: React.FC<MobileQuickNavProps> = ({
  selectedItemsCount,
  actionRequiredCount,
}) => {
  const [activeSection, setActiveSection] = useState<string>('procurement-panel');

  useEffect(() => {
    const handleScroll = () => {
      const panels = [
        'procurement-panel',
        'contracts-panel',
        'guidance-panel',
        'compliance-panel',
      ];

      const scrollPosition = window.scrollY + 200;

      for (const id of panels) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToPanel = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      // Account for sticky header offset
      const yOffset = -140;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav 
      aria-label="Mobile panel quick navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-lg"
    >
      <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => scrollToPanel('procurement-panel')}
          className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition text-[11px] font-semibold ${
            activeSection === 'procurement-panel'
              ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 mb-0.5" />
            {selectedItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                {selectedItemsCount}
              </span>
            )}
          </div>
          <span className="truncate">Procurement</span>
        </button>

        <button
          type="button"
          onClick={() => scrollToPanel('contracts-panel')}
          className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition text-[11px] font-semibold ${
            activeSection === 'contracts-panel'
              ? 'text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <FileText className="w-4 h-4 mb-0.5" />
            {actionRequiredCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {actionRequiredCount}
              </span>
            )}
          </div>
          <span className="truncate">Contracts</span>
        </button>

        <button
          type="button"
          onClick={() => scrollToPanel('guidance-panel')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition text-[11px] font-semibold ${
            activeSection === 'guidance-panel'
              ? 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span className="truncate">Guidance</span>
        </button>

        <button
          type="button"
          onClick={() => scrollToPanel('compliance-panel')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition text-[11px] font-semibold ${
            activeSection === 'compliance-panel'
              ? 'text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Landmark className="w-4 h-4 mb-0.5" />
          <span className="truncate">Compliance</span>
        </button>
      </div>
    </nav>
  );
};
