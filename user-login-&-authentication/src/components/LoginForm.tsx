import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { authService } from '../utils/mockAuthService';
import { UserAccount, UserRole } from '../types';
import { RoleLoginSelector } from './RoleLoginSelector';
import { RoleBadge } from './RoleBadge';
import { DEMO_ROLE_ACCOUNTS, ROLE_CONFIGS } from '../utils/roleConfig';

interface Props {
  onSuccessCredentials: (user: UserAccount) => void;
  onNavigateRegister: () => void;
  onNavigateRecovery: (prefilledEmail?: string) => void;
}

export const LoginForm: React.FC<Props> = ({
  onSuccessCredentials,
  onNavigateRegister,
  onNavigateRecovery,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [email, setEmail] = useState('ramesh.farmer@agriportal.in');
  const [password, setPassword] = useState('FarmerHarvest#2025');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [suggestedRole, setSuggestedRole] = useState<UserRole | null>(null);

  // Detect if entered email belongs to another role without silently auto-switching
  useEffect(() => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setSuggestedRole(null);
      return;
    }
    const foundUser = authService.findUserByEmail(trimmed);
    if (foundUser && foundUser.role && foundUser.role !== selectedRole) {
      setSuggestedRole(foundUser.role);
    } else {
      setSuggestedRole(null);
    }
  }, [email, selectedRole]);

  // Check lockout state on mount and tick down
  useEffect(() => {
    const { isLocked, remainingSeconds } = authService.getLockoutState();
    if (isLocked) {
      setLockoutTimer(remainingSeconds);
    }
  }, []);

  useEffect(() => {
    if (lockoutTimer <= 0) return;
    const interval = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev <= 1) {
          authService.resetLockout();
          setFailedAttempts(0);
          setErrorMsg(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLockOn(e.getModifierState('CapsLock'));
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
    setSuggestedRole(null);
  };

  const handleApplyCredentials = (demoEmail: string, demoPass: string, role: UserRole) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg(null);
    setSuggestedRole(null);
  };

  const handleSwitchToSuggestedRole = () => {
    if (suggestedRole) {
      setSelectedRole(suggestedRole);
      setErrorMsg(null);
      setSuggestedRole(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    setErrorMsg(null);

    // Format validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const user = authService.findUserByEmail(trimmedEmail);

      if (!user || user.passwordHash !== password) {
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);
        authService.addLog({
          type: 'login_failed',
          details: `Failed sign-in attempt for ${trimmedEmail} (${selectedRole} portal).`,
        });

        if (nextFailed >= 4) {
          authService.triggerLockout(30);
          setLockoutTimer(30);
          setErrorMsg('Security Lockout: 4 failed attempts. Please wait 30 seconds.');
        } else {
          setErrorMsg(`Invalid email or password for ${ROLE_CONFIGS[selectedRole].label}. Attempt ${nextFailed} of 4 before temporary lockout.`);
        }
        return;
      }

      // STRICT ROLE VALIDATION: Users can only login with their designated role
      if (user.role !== selectedRole) {
        setSuggestedRole(user.role);
        setErrorMsg(
          `Role Mismatch: This account is registered as a ${ROLE_CONFIGS[user.role].label}, not a ${ROLE_CONFIGS[selectedRole].label}. You can only sign in through the ${ROLE_CONFIGS[user.role].label} portal.`
        );
        authService.addLog({
          type: 'login_failed',
          details: `Access denied: Account ${trimmedEmail} has role '${user.role}' but tried logging in through '${selectedRole}' portal.`,
        });
        return;
      }

      // Successful credentials & role matched, reset failed attempts
      setFailedAttempts(0);
      onSuccessCredentials(user);
    }, 500);
  };

  const currentConfig = ROLE_CONFIGS[selectedRole];

  return (
    <div id="login-card" className="w-full">
      {/* Header */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white shadow-md mb-2.5">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sign In to Your Account
        </h1>
        <div className="flex items-center justify-center gap-2 mt-1.5">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Logging in with:
          </p>
          <RoleBadge role={selectedRole} size="sm" />
        </div>
      </div>

      {/* Role Switcher Grid */}
      <RoleLoginSelector
        selectedRole={selectedRole}
        onSelectRole={handleSelectRole}
        onApplyCredentials={handleApplyCredentials}
        activeEmail={email}
      />

      {/* Lockout Warning Banner */}
      {lockoutTimer > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-rose-600 shrink-0 animate-pulse" />
          <div className="flex-1">
            <p className="font-semibold">Account locked for safety</p>
            <p className="text-[11px] text-rose-700 dark:text-rose-300">
              Too many failed login attempts. Retry in{' '}
              <span className="font-mono font-bold">{lockoutTimer}s</span>.
            </p>
          </div>
        </div>
      )}

      {/* General Error Banner */}
      {errorMsg && lockoutTimer === 0 && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="flex-1 font-medium">{errorMsg}</span>
          </div>
          {suggestedRole && (
            <button
              type="button"
              onClick={handleSwitchToSuggestedRole}
              className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition shadow-xs cursor-pointer"
            >
              <span>Switch to {ROLE_CONFIGS[suggestedRole].label} Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
              {currentConfig.label} Email Address
            </label>
            <span className="text-[10px] text-slate-400">
              {selectedRole === 'farmer'
                ? 'Registered Kisan Email'
                : selectedRole === 'bulk_buyer'
                ? 'Corporate Procurement Email'
                : selectedRole === 'admin'
                ? 'Authorized Officer Email'
                : 'Customer Email'}
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="login-email-input"
              type="email"
              required
              disabled={lockoutTimer > 0 || isSubmitting}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`e.g. yourname@${selectedRole === 'farmer' ? 'kisanfarm.in' : selectedRole === 'bulk_buyer' ? 'agritraders.com' : selectedRole === 'admin' ? 'agriportal.gov' : 'gmail.com'}`}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-transparent transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Password
            </label>
            <button
              type="button"
              onClick={() => onNavigateRecovery(email)}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="login-password-input"
              type={showPassword ? 'text' : 'password'}
              required
              disabled={lockoutTimer > 0 || isSubmitting}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={handleKeyUp}
              placeholder="Enter your account password"
              className="w-full pl-9 pr-10 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:border-transparent transition-all disabled:opacity-50"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Caps Lock notification */}
          {isCapsLockOn && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Caps Lock is on
            </p>
          )}
        </div>

        {/* Remember me & Security Note */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            <span>Remember this device</span>
          </label>
          <span className="text-[11px] text-slate-400">TLS 256-bit encrypted</span>
        </div>

        {/* Submit Button */}
        <button
          id="login-submit-btn"
          type="submit"
          disabled={lockoutTimer > 0 || isSubmitting}
          className="w-full py-2.5 px-4 rounded-lg bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-medium text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 dark:border-slate-900/30 border-t-white dark:border-t-slate-900 rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In as {currentConfig.label}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer link to register */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        Need to join as a {currentConfig.label}?{' '}
        <button
          type="button"
          onClick={onNavigateRegister}
          className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline ml-1 cursor-pointer"
        >
          Create account
        </button>
      </div>
    </div>
  );
};
