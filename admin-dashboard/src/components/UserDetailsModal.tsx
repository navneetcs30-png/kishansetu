import React from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  FileText, 
  CheckCircle2, 
  AlertOctagon, 
  Clock, 
  ShoppingBag,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { PlatformUser } from '../types';

interface UserDetailsModalProps {
  user: PlatformUser | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleSuspend: (userId: string) => void;
  onEditRole: (user: PlatformUser) => void;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  isOpen,
  onClose,
  onToggleSuspend,
  onEditRole,
}) => {
  if (!isOpen || !user) return null;

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'Farmer':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      case 'Bulk Buyer':
        return 'bg-blue-950/80 text-blue-300 border-blue-500/40';
      case 'Consumer':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      case 'Admin':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Active Account
          </span>
        );
      case 'Suspended':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-500/40">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            Suspended
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Pending Verification
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-details-title"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg font-bold text-emerald-400 font-mono">
              {user.avatarSeed}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="user-details-title" className="text-lg font-bold text-slate-100">
                  {user.name}
                </h3>
                <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                  {user.id}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getRoleBadgeStyle(user.role)}`}>
                  {user.role}
                </span>
                {getStatusBadge(user.accountStatus)}
              </div>
            </div>
          </div>

          <button
            id="user-details-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Close user details modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Contact & Registration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2.5 text-slate-300">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-400">Email:</span>
              <span className="font-mono truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-400">Phone:</span>
              <span className="font-mono">{user.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-400">Location:</span>
              <span>{user.location}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-400">Registered:</span>
              <span className="font-mono">{user.registrationDate}</span>
            </div>
          </div>

          {/* Platform Performance Metrics */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Activity & Verification Status
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-xl font-bold text-slate-100 font-mono">
                  {user.activeListingsCount}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Active Listings</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-xl font-bold text-slate-100 font-mono">
                  {user.completedOrdersCount}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Completed Trades</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-xs font-bold text-emerald-400 mt-1">
                  {user.documentStatus}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">KYC / Doc Status</div>
              </div>
            </div>
          </div>

          {/* Operational Notes */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Internal Administrative Notes
            </h4>
            <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              {user.notes || 'No administrative flags or disputes recorded on this profile.'}
            </div>
          </div>

          {/* Compliance Notice */}
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-xs text-emerald-300/90 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-emerald-300">Identity Record Audit: </span>
              Last verified timestamp: <span className="font-mono">{user.verifiedDate || 'Unverified'}</span> • Last session active: <span className="font-mono">{user.lastActive}</span>.
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              id="modal-edit-role-btn"
              onClick={() => {
                onClose();
                onEditRole(user);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Modify Role</span>
            </button>

            <button
              id="modal-toggle-suspend-btn"
              onClick={() => onToggleSuspend(user.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors focus:outline-none focus:ring-2 ${
                user.accountStatus === 'Suspended'
                  ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-700 focus:ring-emerald-500'
                  : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border-rose-700 focus:ring-rose-500'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>{user.accountStatus === 'Suspended' ? 'Reactivate Account' : 'Suspend Account'}</span>
            </button>
          </div>

          <button
            id="modal-close-dismiss-btn"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
