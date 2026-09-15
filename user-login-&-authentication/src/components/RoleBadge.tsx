import React from 'react';
import { UserRole } from '../types';
import { ROLE_CONFIGS } from '../utils/roleConfig';
import { Sprout, ShoppingBag, Building2, ShieldCheck } from 'lucide-react';

interface Props {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const RoleBadge: React.FC<Props> = ({ role, size = 'md', showTagline = false }) => {
  const config = ROLE_CONFIGS[role] || ROLE_CONFIGS.consumer;

  const renderIcon = () => {
    const iconClass = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5';
    switch (role) {
      case 'farmer':
        return <Sprout className={`${iconClass} text-emerald-600 dark:text-emerald-400`} />;
      case 'consumer':
        return <ShoppingBag className={`${iconClass} text-blue-600 dark:text-blue-400`} />;
      case 'bulk_buyer':
        return <Building2 className={`${iconClass} text-amber-600 dark:text-amber-400`} />;
      case 'admin':
        return <ShieldCheck className={`${iconClass} text-purple-600 dark:text-purple-400`} />;
      default:
        return <ShoppingBag className={`${iconClass} text-slate-500`} />;
    }
  };

  const badgeColorClass = () => {
    switch (role) {
      case 'farmer':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60';
      case 'consumer':
        return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/60';
      case 'bulk_buyer':
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60';
      case 'admin':
        return 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/60';
    }
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-[11px] px-2.5 py-0.5 gap-1.5',
    lg: 'text-xs px-3 py-1 gap-2 font-semibold',
  };

  return (
    <div className="inline-flex flex-col">
      <span
        className={`inline-flex items-center rounded-full font-semibold border ${sizeClasses[size]} ${badgeColorClass()}`}
      >
        {renderIcon()}
        <span>{config.label}</span>
      </span>
      {showTagline && (
        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-normal">
          {config.tagline}
        </span>
      )}
    </div>
  );
};
