import React, { useState, useMemo } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, Smartphone, KeyRound, Sprout, ShoppingBag, Building2 } from 'lucide-react';
import { evaluatePasswordStrength } from '../utils/passwordStrength';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { authService } from '../utils/mockAuthService';
import { MfaMethod, UserAccount, UserRole } from '../types';
import { ROLE_CONFIGS, ROLES_LIST } from '../utils/roleConfig';

interface Props {
  onSuccessRegister: (user: UserAccount) => void;
  onNavigateLogin: () => void;
}

export const RegisterForm: React.FC<Props> = ({
  onSuccessRegister,
  onNavigateLogin,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [extraDetail, setExtraDetail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferredMfa, setPreferredMfa] = useState<MfaMethod>('email_otp');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Evaluate password strength live
  const strengthResult = useMemo(() => evaluatePasswordStrength(password), [password]);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (authService.findUserByEmail(trimmedEmail)) {
      setErrorMsg('An account with this email address already exists.');
      return;
    }

    if (strengthResult.score < 45) {
      setErrorMsg('Please choose a stronger password before proceeding.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const roleMeta: Record<string, string> = {};
      if (selectedRole === 'farmer') {
        roleMeta.farmName = extraDetail.trim() || `${trimmedName}'s Farmstead`;
        roleMeta.badgeTitle = 'Registered Producer';
      } else if (selectedRole === 'bulk_buyer') {
        roleMeta.organization = extraDetail.trim() || `${trimmedName} Enterprises`;
        roleMeta.badgeTitle = 'Verified Procurement Partner';
      } else if (selectedRole === 'admin') {
        roleMeta.organization = 'Platform Security & Operations';
        roleMeta.badgeTitle = 'System Administrator';
      } else {
        roleMeta.location = extraDetail.trim() || 'Central Metro';
        roleMeta.badgeTitle = 'Farm-to-Table Shopper';
      }

      const newUser = authService.createUser({
        name: trimmedName,
        email: trimmedEmail,
        password,
        role: selectedRole,
        roleMeta,
        preferredMfa,
        phone: phone.trim() || undefined,
      });

      onSuccessRegister(newUser);
    }, 600);
  };

  const currentConfig = ROLE_CONFIGS[selectedRole];

  return (
    <div id="register-card" className="w-full">
      {/* Header */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white shadow-md mb-2.5">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create Your Account
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Select your portal role to customize permissions and security
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
            Select Your Role
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {ROLES_LIST.map((role) => {
              const cfg = ROLE_CONFIGS[role];
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-900 dark:text-white font-semibold ring-1 ring-indigo-600'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {role === 'farmer' && <Sprout className="w-3.5 h-3.5 text-emerald-500" />}
                    {role === 'consumer' && <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />}
                    {role === 'bulk_buyer' && <Building2 className="w-3.5 h-3.5 text-amber-500" />}
                    {role === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold leading-tight">{cfg.label}</p>
                    <p className="text-[10px] text-slate-400 truncate">{cfg.badge}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="register-name-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Patel"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Role-Specific Detail Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
            {selectedRole === 'farmer'
              ? 'Farm Name & Land Holding'
              : selectedRole === 'bulk_buyer'
              ? 'Company / Trading Entity Name'
              : selectedRole === 'admin'
              ? 'Administrative Office / Security Badge ID'
              : 'Delivery City or Residential Area'}
          </label>
          <input
            type="text"
            value={extraDetail}
            onChange={(e) => setExtraDetail(e.target.value)}
            placeholder={
              selectedRole === 'farmer'
                ? 'e.g. Surya Organic Farms (20 Acres)'
                : selectedRole === 'bulk_buyer'
                ? 'e.g. Royal Agri Exports Private Ltd'
                : selectedRole === 'admin'
                ? 'e.g. SOC Dept Code: AGRI-OPS-04'
                : 'e.g. Metro Greenwoods Colony'
            }
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-transparent transition-all"
          />
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
            {currentConfig.label} Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="register-email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
            Create Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="register-password-input"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 chars, mixed case, numbers & symbols"
              className="w-full pl-9 pr-10 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-transparent transition-all"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Real-time Password Strength Meter */}
          {password.length > 0 && (
            <div className="mt-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-700/60">
              <PasswordStrengthMeter result={strengthResult} showRequirements={true} />
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="register-confirm-password-input"
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                passwordsMismatch
                  ? 'border-rose-400 focus:ring-rose-400'
                  : passwordsMatch
                  ? 'border-emerald-400 focus:ring-emerald-400'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-slate-900 dark:focus:ring-slate-400'
              }`}
            />
          </div>
          {passwordsMismatch && (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-1">
              Passwords do not match
            </p>
          )}
          {passwordsMatch && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              ✓ Passwords match perfectly
            </p>
          )}
        </div>

        {/* Preferred Multi-Factor Verification Method */}
        <div className="pt-1">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
            Default Multi-Factor Authentication Method
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setPreferredMfa('email_otp')}
              className={`p-2 rounded-lg border flex flex-col items-center text-center transition-all cursor-pointer ${
                preferredMfa === 'email_otp'
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold ring-1 ring-indigo-600'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <Mail className="w-4 h-4 mb-1" />
              <span className="text-[11px]">Email OTP</span>
            </button>

            <button
              type="button"
              onClick={() => setPreferredMfa('sms_otp')}
              className={`p-2 rounded-lg border flex flex-col items-center text-center transition-all cursor-pointer ${
                preferredMfa === 'sms_otp'
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold ring-1 ring-indigo-600'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <Smartphone className="w-4 h-4 mb-1" />
              <span className="text-[11px]">SMS Code</span>
            </button>

            <button
              type="button"
              onClick={() => setPreferredMfa('authenticator_app')}
              className={`p-2 rounded-lg border flex flex-col items-center text-center transition-all cursor-pointer ${
                preferredMfa === 'authenticator_app'
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold ring-1 ring-indigo-600'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <KeyRound className="w-4 h-4 mb-1" />
              <span className="text-[11px]">Authenticator</span>
            </button>
          </div>
        </div>

        {preferredMfa === 'sms_otp' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
              Mobile Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
            />
          </div>
        )}

        {/* Submit */}
        <button
          id="register-submit-btn"
          type="submit"
          disabled={isSubmitting || strengthResult.score < 45 || passwordsMismatch}
          className="w-full py-2.5 px-4 rounded-lg bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-medium text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 dark:border-slate-900/30 border-t-white dark:border-t-slate-900 rounded-full animate-spin" />
          ) : (
            <>
              <span>Join as {currentConfig.label}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onNavigateLogin}
          className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline ml-1 cursor-pointer"
        >
          Sign in here
        </button>
      </div>
    </div>
  );
};
