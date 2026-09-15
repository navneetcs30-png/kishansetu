import React from 'react';
import { 
  Shield, 
  Users, 
  Check, 
  Settings2, 
  Sprout, 
  Building2, 
  ShoppingBag, 
  ShieldAlert,
  ArrowRight,
  Sliders
} from 'lucide-react';
import { RoleConfig } from '../types';

interface RolesPermissionsPanelProps {
  roles: RoleConfig[];
  onEditPermissions: (roleConfig: RoleConfig) => void;
}

export const RolesPermissionsPanel: React.FC<RolesPermissionsPanelProps> = ({
  roles,
  onEditPermissions,
}) => {
  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'Farmer':
        return <Sprout className="w-4 h-4 text-emerald-400" />;
      case 'Bulk Buyer':
        return <Building2 className="w-4 h-4 text-blue-400" />;
      case 'Consumer':
        return <ShoppingBag className="w-4 h-4 text-amber-400" />;
      case 'Admin':
        return <ShieldAlert className="w-4 h-4 text-purple-400" />;
      default:
        return <Shield className="w-4 h-4 text-slate-400" />;
    }
  };

  const getBorderColor = (roleName: string) => {
    switch (roleName) {
      case 'Farmer':
        return 'hover:border-emerald-500/50';
      case 'Bulk Buyer':
        return 'hover:border-blue-500/50';
      case 'Consumer':
        return 'hover:border-amber-500/50';
      case 'Admin':
        return 'hover:border-purple-500/50';
      default:
        return 'hover:border-slate-700';
    }
  };

  return (
    <section
      id="panel-roles"
      className="bg-slate-900 border border-slate-800 rounded-xl shadow-sm flex flex-col h-full overflow-hidden"
      aria-labelledby="roles-heading"
    >
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/50">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 id="roles-heading" className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                Roles & Permissions
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  4 Platform Roles
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Access capabilities, active participant volume, and security boundaries.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-[320px] max-h-[440px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {roles.map((item) => {
            const enabledPerms = item.permissions.filter((p) => p.enabled);
            const totalPerms = item.permissions.length;

            return (
              <div
                key={item.role}
                id={`role-card-${item.role.toLowerCase().replace(/\s+/g, '-')}`}
                className={`p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 transition-all flex flex-col justify-between ${getBorderColor(
                  item.role
                )}`}
              >
                <div>
                  {/* Top Row: Role Title & Active User Count */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                        {getRoleIcon(item.role)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                          {item.role}
                        </h3>
                        <span className="text-[10px] text-slate-400 block">
                          {item.tagline}
                        </span>
                      </div>
                    </div>

                    {/* Active Count Pill */}
                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-slate-100">
                        {item.activeUserCount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                        Active Users
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Capabilities Breakdown */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
                      <span>Granted Capabilities</span>
                      <span className="font-mono text-emerald-400 text-[10px]">
                        {enabledPerms.length}/{totalPerms} Active
                      </span>
                    </div>

                    <ul className="space-y-1">
                      {item.permissions.slice(0, 3).map((perm) => (
                        <li
                          key={perm.id}
                          className="flex items-center gap-1.5 text-xs text-slate-300"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate text-[11px]">{perm.name}</span>
                        </li>
                      ))}
                      {item.permissions.length > 3 && (
                        <li className="text-[10px] text-slate-500 italic pl-5">
                          + {item.permissions.length - 3} more operational permissions...
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Card Action Link: Edit Permissions */}
                <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-[10px] font-mono text-slate-500">
                    {item.pendingUserCount > 0 ? (
                      <span className="text-amber-400">{item.pendingUserCount} pending</span>
                    ) : (
                      <span>0 pending</span>
                    )}
                    {item.suspendedUserCount > 0 && (
                      <span className="text-rose-400 ml-1.5">• {item.suspendedUserCount} suspended</span>
                    )}
                  </div>

                  <button
                    type="button"
                    id={`btn-edit-perms-${item.role.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => onEditPermissions(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1.5 py-0.5"
                    aria-label={`Edit permissions for ${item.role}`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Edit Permissions</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Role privileges enforce zero-trust field access across all API endpoints.</span>
        <span className="font-mono text-slate-500 hidden sm:inline">RBAC v3.4 Active</span>
      </div>
    </section>
  );
};
