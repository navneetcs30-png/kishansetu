import React, { useState } from 'react';
import { X, UserCog, Check, AlertCircle } from 'lucide-react';
import { PlatformUser, Role } from '../types';

interface EditRoleModalProps {
  user: PlatformUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveRole: (userId: string, newRole: Role) => void;
}

const ROLES_INFO: { role: Role; desc: string; color: string }[] = [
  { role: 'Farmer', desc: 'Can publish crop harvest lots, set floor prices, and withdraw escrow payouts.', color: 'emerald' },
  { role: 'Bulk Buyer', desc: 'Can issue RFQs, place truckload bookings, and receive B2B credit terms.', color: 'blue' },
  { role: 'Consumer', desc: 'Can browse direct harvests, place parcel orders, and track cold chain deliveries.', color: 'amber' },
  { role: 'Admin', desc: 'Internal operations supervisory access with document review and dispute powers.', color: 'purple' },
];

export const EditRoleModal: React.FC<EditRoleModalProps> = ({
  user,
  isOpen,
  onClose,
  onSaveRole,
}) => {
  const [selectedRole, setSelectedRole] = useState<Role>(user?.role || 'Farmer');

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveRole(user.id, selectedRole);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-role-title"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <UserCog className="w-4 h-4" />
            </div>
            <div>
              <h3 id="edit-role-title" className="text-sm font-bold text-slate-100">
                Modify User Role
              </h3>
              <p className="text-xs text-slate-400">
                Editing: <span className="text-slate-200 font-medium">{user.name}</span> ({user.id})
              </p>
            </div>
          </div>
          <button
            id="edit-role-close-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Close edit role modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="text-xs text-slate-300">
            Select the new functional role for this account. Note that changing a user's role alters their platform permission boundaries and dashboard layout.
          </div>

          <fieldset className="space-y-2.5">
            <legend className="sr-only">Choose a platform role</legend>
            {ROLES_INFO.map((item) => {
              const isSelected = selectedRole === item.role;
              return (
                <label
                  key={item.role}
                  htmlFor={`role-option-${item.role.replace(/\s+/g, '-').toLowerCase()}`}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500/80 ring-1 ring-emerald-500/40'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <input
                    type="radio"
                    id={`role-option-${item.role.replace(/\s+/g, '-').toLowerCase()}`}
                    name="platform-role-choice"
                    value={item.role}
                    checked={isSelected}
                    onChange={() => setSelectedRole(item.role)}
                    className="mt-0.5 text-emerald-500 focus:ring-emerald-500 h-4 w-4 bg-slate-900 border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-100">
                        {item.role}
                      </span>
                      {user.role === item.role && (
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                          Current Role
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </label>
              );
            })}
          </fieldset>

          {selectedRole !== user.role && (
            <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Role will change from <strong>{user.role}</strong> to <strong>{selectedRole}</strong> upon saving.</span>
            </div>
          )}

          {/* Footer */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              id="edit-role-cancel-btn"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="edit-role-save-btn"
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              Save Role Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
