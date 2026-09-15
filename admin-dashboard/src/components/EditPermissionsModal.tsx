import React, { useState } from 'react';
import { X, Shield, Check, ToggleLeft, ToggleRight, RotateCcw, AlertTriangle } from 'lucide-react';
import { RoleConfig, PermissionItem } from '../types';

interface EditPermissionsModalProps {
  roleConfig: RoleConfig | null;
  isOpen: boolean;
  onClose: () => void;
  onSavePermissions: (role: string, updatedPermissions: PermissionItem[]) => void;
}

export const EditPermissionsModal: React.FC<EditPermissionsModalProps> = ({
  roleConfig,
  isOpen,
  onClose,
  onSavePermissions,
}) => {
  if (!isOpen || !roleConfig) return null;

  const [permissions, setPermissions] = useState<PermissionItem[]>(roleConfig.permissions);
  const [dirty, setDirty] = useState<boolean>(false);

  const handleToggle = (id: string) => {
    setPermissions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
    setDirty(true);
  };

  const handleReset = () => {
    setPermissions(roleConfig.permissions);
    setDirty(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePermissions(roleConfig.role, permissions);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-permissions-title"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 id="edit-permissions-title" className="text-base font-bold text-slate-100">
                Configure Role Permissions: <span className="text-emerald-400">{roleConfig.role}</span>
              </h3>
              <p className="text-xs text-slate-400">
                Controls feature access, transaction capabilities, and marketplace privileges.
              </p>
            </div>
          </div>
          <button
            id="edit-permissions-close-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Close permissions dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col min-h-0">
          <div className="p-5 space-y-3 overflow-y-auto flex-1">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1 border-b border-slate-800">
              <span>{permissions.filter(p => p.enabled).length} of {permissions.length} capabilities currently granted</span>
              {dirty && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-slate-400 hover:text-slate-200 flex items-center gap-1 focus:outline-none"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Changes</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              {permissions.map((perm) => (
                <div
                  key={perm.id}
                  className={`p-3 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                    perm.enabled
                      ? 'bg-slate-950/70 border-slate-700/80 hover:border-slate-600'
                      : 'bg-slate-950/30 border-slate-800/60 opacity-60'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200">
                        {perm.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                        {perm.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {perm.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    id={`toggle-perm-${perm.id}`}
                    onClick={() => handleToggle(perm.id)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      perm.enabled ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}
                    role="switch"
                    aria-checked={perm.enabled}
                    aria-label={`Toggle ${perm.name}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        perm.enabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3">
            <div className="text-[11px] text-slate-400">
              Affects {roleConfig.activeUserCount} active {roleConfig.role} accounts immediately.
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="edit-permissions-cancel-btn"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="edit-permissions-save-btn"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                Save Role Matrix
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
