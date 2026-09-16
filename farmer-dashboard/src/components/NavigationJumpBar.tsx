import React from 'react';
import { Wheat, Carrot, BookOpen, Landmark, Sparkles, Bot, LayoutGrid } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface NavigationJumpBarProps {
  totalGrainValue: number;
  totalVegetableValue: number;
  onOpenAI?: () => void;
  activePanel: string;
  onSelectPanel: (panelId: string) => void;
}

export const NavigationJumpBar: React.FC<NavigationJumpBarProps> = ({
  totalGrainValue,
  totalVegetableValue,
  onOpenAI,
  activePanel,
  onSelectPanel,
}) => {
  const navItems = [
    {
      id: 'panel-grains',
      label: 'Grain & Crop Rates',
      sublabel: 'MSP Value',
      icon: Wheat,
      badge: totalGrainValue > 0 ? formatINR(totalGrainValue) : '6 Crops',
      activeColor: 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700',
    },
    {
      id: 'panel-vegetables',
      label: 'Vegetable Market',
      sublabel: 'Mandi Rates',
      icon: Carrot,
      badge: totalVegetableValue > 0 ? formatINR(totalVegetableValue) : '6 Mandis',
      activeColor: 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700',
    },
    {
      id: 'panel-guidance',
      label: 'Production Guidance',
      sublabel: 'Best Practices',
      icon: BookOpen,
      badge: '4 Stages',
      activeColor: 'text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700',
    },
    {
      id: 'panel-schemes',
      label: 'Government Schemes',
      sublabel: 'Support & Portals',
      icon: Landmark,
      badge: '6 Schemes',
      activeColor: 'text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-700',
    },
  ];

  const handleItemClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    onSelectPanel(id);
    window.scrollTo({
      top: 140,
      behavior: 'smooth',
    });
  };

  return (
    <nav
      aria-label="Dashboard quick navigation"
      className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between overflow-x-auto py-2.5 scrollbar-none gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap min-w-max">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:inline-block mr-1">
              Panels:
            </span>

            {/* Individual Panel Buttons (Clicking shows this panel and hides the others) */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePanel === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  id={`btn-${item.id}`}
                  onClick={(e) => handleItemClick(item.id, e)}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-1 ${
                    isActive
                      ? `${item.activeColor} shadow-xs ring-1 ring-emerald-500/40`
                      : 'text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-700'
                  }`}
                  title={`Show ${item.label} (hides other panels)`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-current' : 'text-slate-500 dark:text-slate-400'}`} aria-hidden="true" />
                  <span>{item.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/80 dark:bg-slate-900/80 text-current shadow-2xs'
                        : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                </button>
              );
            })}

            {/* All Panels (2x2 Grid View) Toggle */}
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />
            <button
              type="button"
              id="btn-panel-all"
              onClick={(e) => handleItemClick('all', e)}
              aria-pressed={activePanel === 'all'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activePanel === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
              }`}
              title="Show all 4 panels simultaneously in 2x2 grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All Panels (Grid)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 flex-shrink-0">
            {onOpenAI && (
              <button
                type="button"
                onClick={onOpenAI}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 shadow-2xs transition-colors border border-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-emerald-950" />
                <span>Ask AI (किसान सहायक)</span>
                <Sparkles className="w-3 h-3 text-emerald-900" />
              </button>
            )}
            <span className="hidden lg:inline-flex items-center gap-1.5 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{activePanel === 'all' ? '2×2 Grid Active' : 'Focused Panel Mode'}</span>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};
