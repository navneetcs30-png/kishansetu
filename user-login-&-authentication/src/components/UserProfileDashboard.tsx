import React, { useState } from 'react';
import { UserAccount, MfaMethod, UserRole } from '../types';
import { 
  ShieldCheck, 
  LogOut, 
  KeyRound, 
  Mail, 
  Smartphone, 
  Clock, 
  Laptop, 
  History, 
  CheckCircle2, 
  RotateCcw,
  Sprout,
  ShoppingBag,
  Building2,
  Lock,
  Boxes,
  Truck,
  TrendingUp,
  FileText,
  BadgeCheck,
  Users
} from 'lucide-react';
import { authService } from '../utils/mockAuthService';
import { RoleBadge } from './RoleBadge';
import { ROLE_CONFIGS } from '../utils/roleConfig';

interface Props {
  user: UserAccount;
  onSignOut: () => void;
  onTriggerRecoveryDemo: () => void;
  onLaunchDashboard?: (role: UserRole) => void;
}

export const UserProfileDashboard: React.FC<Props> = ({
  user,
  onSignOut,
  onTriggerRecoveryDemo,
  onLaunchDashboard,
}) => {
  const [activeMfa, setActiveMfa] = useState<MfaMethod>(user.preferredMfa);
  const [mfaEnabled, setMfaEnabled] = useState(user.mfaEnabled);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const logs = authService.getSecurityLogs();
  const userRole: UserRole = user.role || 'consumer';
  const roleConfig = ROLE_CONFIGS[userRole] || ROLE_CONFIGS.consumer;

  const handleUpdateMfa = (method: MfaMethod) => {
    setActiveMfa(method);
    authService.updateUserMfa(user.id, mfaEnabled, method);
    setStatusMessage(`Default verification method changed to ${method === 'email_otp' ? 'Email OTP' : method === 'sms_otp' ? 'SMS Code' : 'Authenticator App'}.`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleToggleMfa = () => {
    const nextState = !mfaEnabled;
    setMfaEnabled(nextState);
    authService.updateUserMfa(user.id, nextState, activeMfa);
    setStatusMessage(nextState ? 'Multi-Factor Verification enabled.' : 'Warning: Multi-Factor Verification disabled.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const renderRoleSpecificWorkspace = () => {
    switch (userRole) {
      case 'farmer':
        return (
          <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Farmer Portal • {user.roleMeta?.farmName || 'Kisan Agricultural Operations'}
                  </h3>
                  <p className="text-xs text-slate-500">Produce listings, harvest management & direct mandis</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                MSP Guaranteed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40">
                <p className="text-slate-500 text-[11px]">Active Crops Listed</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">3 Crops</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Wheat, Mustard & Rice</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40">
                <p className="text-slate-500 text-[11px]">Bulk Buyer Inquiries</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">14 Bids</p>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Avg $280/Quintal</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40">
                <p className="text-slate-500 text-[11px]">Direct Payouts</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">$18,450</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Direct Bank Transfer</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {roleConfig.permissions.map((perm) => (
                <span key={perm} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{perm}</span>
                </span>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onLaunchDashboard ? onLaunchDashboard('farmer') : (window.location.hash = '#farmer')}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Sprout className="w-4 h-4" />
                <span>Launch Farmer Agricultural Hub (Live) →</span>
              </button>
            </div>
          </div>
        );

      case 'consumer':
        return (
          <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/50 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Consumer Portal • Farm-to-Table Marketplace
                  </h3>
                  <p className="text-xs text-slate-500">Fresh organic food directly from local producers</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                Certified 100% Organic
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/40">
                <p className="text-slate-500 text-[11px]">Active Orders</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">2 Deliveries</p>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">In transit from Farm #12</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/40">
                <p className="text-slate-500 text-[11px]">Saved Verified Farmers</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">8 Farms</p>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Regular Weekly Subscriptions</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/40">
                <p className="text-slate-500 text-[11px]">Carbon Offset Saved</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">34.2 kg</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Zero middlemen shipping</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {roleConfig.permissions.map((perm) => (
                <span key={perm} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                  <span>{perm}</span>
                </span>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onLaunchDashboard ? onLaunchDashboard('consumer') : (window.location.hash = '#consumer')}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Enter AgriDirect Consumer Marketplace (Live) →</span>
              </button>
            </div>
          </div>
        );

      case 'bulk_buyer':
        return (
          <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/50 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Bulk Buyer Procurement • {user.roleMeta?.organization || 'Commercial Operations'}
                  </h3>
                  <p className="text-xs text-slate-500">Industrial contracts, wholesale freight & cold-chain distribution</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                Corporate Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900/40">
                <p className="text-slate-500 text-[11px]">Monthly Procurement</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">120 Metric Tons</p>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Grain & pulses portfolio</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900/40">
                <p className="text-slate-500 text-[11px]">Active Contracts</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">18 Farmer Hubs</p>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Direct mandi contracts</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900/40">
                <p className="text-slate-500 text-[11px]">Logistics Status</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">4 Freight Fleets</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Real-time GPS tracking</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {roleConfig.permissions.map((perm) => (
                <span key={perm} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>{perm}</span>
                </span>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onLaunchDashboard ? onLaunchDashboard('bulk_buyer') : (window.location.hash = '#bulk_buyer')}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <span>Launch B2B Bulk Procurement Portal (Live) →</span>
              </button>
            </div>
          </div>
        );

      case 'admin':
        return (
          <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800/50 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Platform Security & Administration Console
                  </h3>
                  <p className="text-xs text-slate-500">Root governance, KYC review & system telemetry</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                Superuser Clearance
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40">
                <p className="text-slate-500 text-[11px]">Farmers Registered</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">1,420</p>
                <p className="text-[10px] text-emerald-600 font-medium">98.4% KYC Verified</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40">
                <p className="text-slate-500 text-[11px]">Bulk Buyer Entities</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">85 Firms</p>
                <p className="text-[10px] text-purple-600 font-medium">Active Escrow</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40">
                <p className="text-slate-500 text-[11px]">Consumers Active</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">18,900</p>
                <p className="text-[10px] text-blue-600 font-medium">Verified Accounts</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40">
                <p className="text-slate-500 text-[11px]">Security Score</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">99.8%</p>
                <p className="text-[10px] text-emerald-600 font-medium">Zero breaches</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {roleConfig.permissions.map((perm) => (
                <span key={perm} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-purple-500" />
                  <span>{perm}</span>
                </span>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onLaunchDashboard ? onLaunchDashboard('admin') : (window.location.hash = '#admin')}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Open Admin Operations & KYC Console (Live) →</span>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div id="user-profile-dashboard" className="w-full max-w-3xl mx-auto space-y-6">
      {/* Top Profile Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 dark:border-slate-800 shadow"
              />
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-white" title="Verified & Authenticated">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                <RoleBadge role={userRole} size="md" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                <span>Account: <span className="font-mono text-[11px]">{user.id}</span></span>
                {user.roleMeta?.farmName && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">🚜 {user.roleMeta.farmName}</span>
                  </>
                )}
                {user.roleMeta?.organization && (
                  <>
                    <span>•</span>
                    <span className="text-amber-600 dark:text-amber-400 font-medium">🏢 {user.roleMeta.organization}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={onTriggerRecoveryDemo}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Test Reset</span>
            </button>
            <button
              type="button"
              onClick={onSignOut}
              className="px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="mt-4 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Role-Specific Workspace & Permissions */}
      {renderRoleSpecificWorkspace()}

      {/* Security Health & 2FA Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Multi-Factor Authentication Settings */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Multi-Factor Verification (2FA)
                </h3>
                <p className="text-xs text-slate-500">Enhanced protection against compromised passwords</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleMfa}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                mfaEnabled
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {mfaEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="space-y-2 pt-1 text-xs">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Default Verification Method:
            </label>

            <button
              type="button"
              disabled={!mfaEnabled}
              onClick={() => handleUpdateMfa('email_otp')}
              className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                activeMfa === 'email_otp' && mfaEnabled
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-slate-900 dark:text-white font-medium ring-1 ring-indigo-600'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              } disabled:opacity-50`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-600" />
                <div>
                  <p className="font-semibold text-xs">One-Time Passcode (Email OTP)</p>
                  <p className="text-[11px] text-slate-500">Sends 6-digit code to {user.email}</p>
                </div>
              </div>
              {activeMfa === 'email_otp' && mfaEnabled && (
                <span className="text-[10px] font-bold text-indigo-600 uppercase">Active</span>
              )}
            </button>

            <button
              type="button"
              disabled={!mfaEnabled}
              onClick={() => handleUpdateMfa('sms_otp')}
              className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                activeMfa === 'sms_otp' && mfaEnabled
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-slate-900 dark:text-white font-medium ring-1 ring-indigo-600'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              } disabled:opacity-50`}
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-teal-600" />
                <div>
                  <p className="font-semibold text-xs">SMS Text Verification</p>
                  <p className="text-[11px] text-slate-500">Sends SMS code to {user.phone || 'mobile device'}</p>
                </div>
              </div>
              {activeMfa === 'sms_otp' && mfaEnabled && (
                <span className="text-[10px] font-bold text-indigo-600 uppercase">Active</span>
              )}
            </button>

            <button
              type="button"
              disabled={!mfaEnabled}
              onClick={() => handleUpdateMfa('authenticator_app')}
              className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                activeMfa === 'authenticator_app' && mfaEnabled
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-slate-900 dark:text-white font-medium ring-1 ring-indigo-600'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              } disabled:opacity-50`}
            >
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <div>
                  <p className="font-semibold text-xs">Authenticator App (TOTP)</p>
                  <p className="text-[11px] text-slate-500">Google Authenticator, 1Password, or Authy</p>
                </div>
              </div>
              {activeMfa === 'authenticator_app' && mfaEnabled && (
                <span className="text-[10px] font-bold text-indigo-600 uppercase">Active</span>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Backup Recovery Codes:</span>
            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
              {user.backupCodes.length} available
            </span>
          </div>
        </div>

        {/* Card 2: Active Session & Security Metrics */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Active Session Telemetry
              </h3>
              <p className="text-xs text-slate-500">Role-gated portal & encryption standards</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Portal Authority</span>
                <span className="font-semibold text-slate-900 dark:text-white">{roleConfig.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Session Protection</span>
                <span className="text-emerald-600 font-semibold text-[11px]">TLS 1.3 / AES-256</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Brute-Force Safeguard</span>
                <span className="text-indigo-600 font-semibold text-[11px]">4-Attempt Rate Limit</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Last Sign In</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">
                  {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-indigo-950 dark:text-indigo-200">
                  <p className="font-semibold mb-0.5">Role-Based Access Control (RBAC)</p>
                  <p className="text-indigo-900/80 dark:text-indigo-300/80 leading-relaxed">
                    Permissions are enforced for {roleConfig.label} privileges. Any attempt to elevate access without proper re-authentication will be automatically logged.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Audit Log */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Security & Authentication Events
            </h3>
          </div>
          <span className="text-xs text-slate-400">Live Audit Trail</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-2 font-medium">Event Type</th>
                <th className="pb-2 font-medium">Details</th>
                <th className="pb-2 font-medium">Device & IP</th>
                <th className="pb-2 font-medium text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {logs.slice(0, 6).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200">
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        log.type === 'login_success' || log.type === 'mfa_verified'
                          ? 'bg-emerald-500'
                          : log.type === 'password_reset'
                          ? 'bg-indigo-500'
                          : log.type === 'account_created'
                          ? 'bg-teal-500'
                          : 'bg-rose-500'
                      }`}
                    />
                    <span className="capitalize">{log.type.replace('_', ' ')}</span>
                  </td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {log.details}
                  </td>
                  <td className="py-2.5 text-slate-500 font-mono text-[11px]">
                    {log.ip}
                  </td>
                  <td className="py-2.5 text-right text-slate-400 font-mono text-[11px]">
                    <span className="flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
