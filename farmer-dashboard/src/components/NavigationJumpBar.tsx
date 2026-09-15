import React, { useEffect, useState } from 'react';
import { Wheat, Carrot, BookOpen, Landmark, Sparkles, Bot } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface NavigationJumpBarProps {
  totalGrainValue: number;
  totalVegetableValue: number;
  onOpenAI?: () => void;
}

export const NavigationJumpBar: React.FC<NavigationJumpBarProps> = ({
  totalGrainValue,
  totalVegetableValue,
  onOpenAI,
}) => {
  const [activePanel, setActivePanel] = useState<string>('panel-grains');

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = navItems.length - 1; i >= 0; i--) {
        const el = document.getElementById(navItems[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActivePanel(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleJump = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActivePanel(id);
    const target = document.getElementById(id);
    if (target) {
      const headerOffset = 72; // sticky header + jump bar height offset
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
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
              Jump To:
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePanel === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleJump(item.id, e)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-1 ${
                    isActive
                      ? `${item.activeColor} shadow-xs`
                      : 'text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-700'
                  }`}
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
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 flex-shrink-0">
            {onOpenAI && (
              <button
                type="button"
                onClick={onOpenAI}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 shadow-2xs transition-colors border border-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <Bot className="w-3.5 h-3.5 text-emerald-950" />
                <span>Ask AI (किसान सहायक)</span>
                <Sparkles className="w-3 h-3 text-emerald-900" />
              </button>
            )}
            <span className="hidden lg:inline-flex items-center gap-1.5 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Live Auto-Calculations Enabled</span>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};
