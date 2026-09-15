import React from 'react';
import { UserRole } from '../types';
import { DEMO_ROLE_ACCOUNTS, ROLE_CONFIGS } from '../utils/roleConfig';
import { Sprout, ShoppingBag, Building2, ShieldCheck, Check, Sparkles, UserCheck } from 'lucide-react';

interface Props {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onApplyCredentials: (email: string, password: string, role: UserRole) => void;
  activeEmail: string;
}

export const RoleLoginSelector: React.FC<Props> = ({
  selectedRole,
  onSelectRole,
  onApplyCredentials,
  activeEmail,
}) => {
  const currentConfig = ROLE_CONFIGS[selectedRole];
  const currentDemo = DEMO_ROLE_ACCOUNTS.find((d) => d.role === selectedRole);

  const getRoleIcon = (role: UserRole, isSelected: boolean) => {
    const iconClass = 'w-4 h-4 transition-transform group-hover:scale-110';
    switch (role) {
      case 'farmer':
        return <Sprout className={`${iconClass} ${isSelected ? 'text-emerald-500' : 'text-slate-400'}`} />;
      case 'consumer':
        return <ShoppingBag className={`${iconClass} ${isSelected ? 'text-blue-500' : 'text-slate-400'}`} />;
      case 'bulk_buyer':
        return <Building2 className={`${iconClass} ${isSelected ? 'text-amber-500' : 'text-slate-400'}`} />;
      case 'admin':
        return <ShieldCheck className={`${iconClass} ${isSelected ? 'text-purple-500' : 'text-slate-400'}`} />;
    }
  };

  const getBorderAndBg = (role: UserRole, isSelected: boolean) => {
    if (!isSelected) {
      return 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300';
    }
    switch (role) {
      case 'farmer':
        return 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/20';
      case 'consumer':
        return 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 ring-2 ring-blue-500/20';
      case 'bulk_buyer':
        return 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 ring-2 ring-amber-500/20';
      case 'admin':
        return 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100 ring-2 ring-purple-500/20';
    }
  };

  return (
    <div id="role-login-selector" className="mb-6 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
          Choose Portal Access Role
        </label>
        <span className="text-[11px] text-slate-400">4 Distinct Roles</span>
      </div>

      {/* 4 Roles Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {DEMO_ROLE_ACCOUNTS.map((account) => {
          const isSelected = selectedRole === account.role;
          const config = ROLE_CONFIGS[account.role];
          const isFilled = activeEmail.toLowerCase() === account.email.toLowerCase();

          return (
            <button
              key={account.role}
              type="button"
              id={`role-btn-${account.role}`}
              onClick={() => {
                onSelectRole(account.role);
                onApplyCredentials(account.email, account.password, account.role);
              }}
              className={`group relative p-2.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between cursor-pointer ${getBorderAndBg(
                account.role,
                isSelected
              )}`}
            >
              <div className="flex items-start justify-between w-full mb-1.5">
                <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                  {getRoleIcon(account.role, isSelected)}
                </div>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-[10px]">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>

              <div>
                <p className="font-bold text-xs leading-tight text-slate-900 dark:text-white">
                  {config.label}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {account.name}
                </p>
              </div>

              {isFilled && (
                <div className="mt-1.5 flex items-center gap-1 text-[9px] font-semibold text-indigo-600 dark:text-indigo-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                  Active
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Role Feature Summary Banner */}
      {currentDemo && (
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={currentDemo.avatarUrl}
              alt={currentDemo.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
            />
            <div className="truncate">
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-semibold text-slate-900 dark:text-white text-[11px] truncate">
                  {currentDemo.name}
                </span>
                <span className="text-[10px] text-slate-400 truncate hidden sm:inline">
                  • {currentDemo.roleBadge}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {currentDemo.hint}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onApplyCredentials(currentDemo.email, currentDemo.password, currentDemo.role)}
            className="shrink-0 px-2 py-1 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 font-medium text-[11px] flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
            title={`Fill ${currentConfig.label} login credentials`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Fill Demo</span>
          </button>
        </div>
      )}
    </div>
  );
};
