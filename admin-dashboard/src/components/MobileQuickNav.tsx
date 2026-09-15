import React from 'react';
import { Users, FileCheck2, BookOpen, ShieldAlert } from 'lucide-react';

interface MobileQuickNavProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
  pendingVerificationsCount: number;
  totalUsersCount: number;
}

export const MobileQuickNav: React.FC<MobileQuickNavProps> = ({
  activeSection,
  onSelectSection,
  pendingVerificationsCount,
  totalUsersCount,
}) => {
  const navItems = [
    {
      id: 'panel-users',
      label: 'Users',
      badge: totalUsersCount.toString(),
      badgeType: 'neutral',
      icon: Users,
    },
    {
      id: 'panel-verifications',
      label: 'Queue',
      badge: pendingVerificationsCount > 0 ? pendingVerificationsCount.toString() : undefined,
      badgeType: 'warning',
      icon: FileCheck2,
    },
    {
      id: 'panel-guidance',
      label: 'Guidance',
      badge: '4',
      badgeType: 'neutral',
      icon: BookOpen,
    },
    {
      id: 'panel-roles',
      label: 'Roles',
      badge: '4',
      badgeType: 'neutral',
      icon: ShieldAlert,
    },
  ];

  const handleNavClick = (id: string) => {
    onSelectSection(id);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 130;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="lg:hidden sticky top-[108px] z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-3 py-2 shadow-lg">
      <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5" role="navigation" aria-label="Mobile quick navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              id={`mob-nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
              aria-current={isActive ? 'true' : 'false'}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold ${
                    item.badgeType === 'warning'
                      ? isActive
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : isActive
                      ? 'bg-emerald-800 text-emerald-100'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
