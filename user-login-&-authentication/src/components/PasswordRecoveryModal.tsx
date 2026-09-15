import React, { useState, useMemo, useEffect } from 'react';
import { Mail, ArrowLeft, ArrowRight, ShieldAlert, CheckCircle2, Lock, Eye, EyeOff, Sparkles, KeySquare, Send } from 'lucide-react';
import { RecoveryMethod } from '../types';
import { authService } from '../utils/mockAuthService';
import { evaluatePasswordStrength } from '../utils/passwordStrength';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { OtpInput } from './OtpInput';

interface Props {
  initialEmail?: string;
  onSuccessReset: (email: string) => void;
  onCancel: () => void;
}

export const PasswordRecoveryModal: React.FC<Props> = ({
  initialEmail = '',
  onSuccessReset,
  onCancel,
}) => {
  type Step = 'choose_method' | 'enter_otp' | 'reset_password' | 'success';

  const [step, setStep] = useState<Step>('choose_method');
  const [email, setEmail] = useState(initialEmail);
  const [recoveryMethod, setRecoveryMethod] = useState<RecoveryMethod>('otp');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);

  // Evaluate new password strength
  const strengthResult = useMemo(() => evaluatePasswordStrength(newPassword), [newPassword]);
  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  // Tick cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  // Send OTP or Magic Link
  const handleDispatchRecovery = () => {
    setErrorMsg(null);
    const trimmed = email.trim().toLowerCase();

    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const user = authService.findUserByEmail(trimmed);
    if (!user) {
      // For security, standard practice says don't reveal existence, but for clarity in preview:
      setErrorMsg('No registered account found with this email address. Try a demo account or create one.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      if (recoveryMethod === 'otp') {
        authService.sendOtp(trimmed, 'password_recovery', 'email');
        setStep('enter_otp');
        setResendCooldown(30);
      } else {
        // Magic link
        authService.sendMagicLink(trimmed);
        setStep('reset_password'); // Simulate following the link
      }
    }, 450);
  };

  // Verify OTP for password recovery
  const handleVerifyOtp = (codeOverride?: string) => {
    const code = (codeOverride || otpCode).trim();
    setErrorMsg(null);

    if (code.length !== 6) {
      setErrorMsg('Please enter the complete 6-digit OTP code.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const res = authService.verifyOtp(email.trim().toLowerCase(), code, 'password_recovery');
      if (res.success) {
        setStep('reset_password');
      } else {
        setErrorMsg(res.error || 'Invalid recovery code.');
      }
    }, 400);
  };

  // Submit final password change
  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (strengthResult.score < 45) {
      setErrorMsg('Please choose a stronger password to ensure your account security.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const updated = authService.updatePassword(email.trim().toLowerCase(), newPassword);
      if (updated) {
        setStep('success');
      } else {
        setErrorMsg('Failed to update password. Please try again.');
      }
    }, 500);
  };

  // Find latest generated recovery notification for quick test
  const latestRecoveryNotif = authService
    .getNotifications()
    .find((n) => n.purpose === 'password_recovery' && n.recipient.toLowerCase() === email.trim().toLowerCase());

  return (
    <div id="password-recovery-card" className="w-full">
      {/* Back Button */}
      {step !== 'success' && (
        <div className="mb-4">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </button>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white shadow-md mb-2">
          {step === 'success' ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          ) : (
            <KeySquare className="w-6 h-6 text-indigo-400" />
          )}
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          {step === 'choose_method' && 'Password Recovery Options'}
          {step === 'enter_otp' && 'Enter Recovery OTP Code'}
          {step === 'reset_password' && 'Create New Password'}
          {step === 'success' && 'Password Reset Successful'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {step === 'choose_method' && 'Choose your preferred verification method to securely reset your credentials'}
          {step === 'enter_otp' && `Enter the one-time passcode sent to ${email}`}
          {step === 'reset_password' && 'Choose a strong, unique password with high entropy'}
          {step === 'success' && 'Your credentials have been securely updated. You can now sign in.'}
        </p>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="mb-4 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: CHOOSE METHOD */}
      {step === 'choose_method' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
              Account Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Select Recovery Method:
            </label>
            <div className="space-y-2">
              <label
                className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer transition-all ${
                  recoveryMethod === 'otp'
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30 ring-1 ring-indigo-600'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="recoveryMethod"
                  checked={recoveryMethod === 'otp'}
                  onChange={() => setRecoveryMethod('otp')}
                  className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <KeySquare className="w-3.5 h-3.5 text-indigo-600" /> Secure 6-Digit OTP Code
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Receive a single-use verification code in your email inbox with a 5-minute validity window.
                  </p>
                </div>
              </label>

              <label
                className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer transition-all ${
                  recoveryMethod === 'magic_link'
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30 ring-1 ring-indigo-600'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="recoveryMethod"
                  checked={recoveryMethod === 'magic_link'}
                  onChange={() => setRecoveryMethod('magic_link')}
                  className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-teal-600" /> Direct Secure Reset Link (Magic Link)
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Receive a signed cryptographic URL link to reset your password directly in one click.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <button
            type="button"
            disabled={isSubmitting || !email.trim()}
            onClick={handleDispatchRecovery}
            className="w-full py-2.5 px-4 rounded-lg bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin" />
            ) : (
              <>
                <span>Send {recoveryMethod === 'otp' ? 'Recovery Code' : 'Reset Link'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* STEP 2: ENTER OTP */}
      {step === 'enter_otp' && (
        <div className="space-y-4">
          {latestRecoveryNotif?.code && (
            <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-indigo-900 dark:text-indigo-200">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Simulated Email OTP:</span>
                <span className="font-mono font-bold text-sm tracking-wider">{latestRecoveryNotif.code}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOtpCode(latestRecoveryNotif.code!);
                  handleVerifyOtp(latestRecoveryNotif.code);
                }}
                className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[11px]"
              >
                Auto-fill
              </button>
            </div>
          )}

          <OtpInput
            value={otpCode}
            onChange={(val) => {
              setOtpCode(val);
              if (val.length === 6) handleVerifyOtp(val);
            }}
            hasError={!!errorMsg}
            disabled={isSubmitting}
          />

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Code expires in 5 minutes</span>
            <button
              type="button"
              disabled={resendCooldown > 0}
              onClick={() => {
                authService.sendOtp(email.trim().toLowerCase(), 'password_recovery', 'email');
                setResendCooldown(30);
              }}
              className="font-medium text-indigo-600 hover:underline disabled:text-slate-400 disabled:no-underline"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
            </button>
          </div>

          <button
            type="button"
            disabled={isSubmitting || otpCode.length !== 6}
            onClick={() => handleVerifyOtp()}
            className="w-full py-2.5 px-4 rounded-lg bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin" />
            ) : (
              <span>Verify & Continue</span>
            )}
          </button>
        </div>
      )}

      {/* STEP 3: RESET PASSWORD */}
      {step === 'reset_password' && (
        <form onSubmit={handleSaveNewPassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter strong new password"
                className="w-full pl-9 pr-10 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {newPassword.length > 0 && (
              <div className="mt-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-700/60">
                <PasswordStrengthMeter result={strengthResult} showRequirements={true} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  passwordsMismatch
                    ? 'border-rose-400 focus:ring-rose-400'
                    : passwordsMatch
                    ? 'border-emerald-400 focus:ring-emerald-400'
                    : 'border-slate-300 dark:border-slate-700 focus:ring-slate-900'
                }`}
              />
            </div>
            {passwordsMismatch && (
              <p className="text-[11px] text-rose-600 font-medium mt-1">Passwords do not match</p>
            )}
            {passwordsMatch && (
              <p className="text-[11px] text-emerald-600 font-medium mt-1">✓ Passwords match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || strengthResult.score < 45 || passwordsMismatch}
            className="w-full py-2.5 px-4 rounded-lg bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin" />
            ) : (
              <span>Update Password & Complete Recovery</span>
            )}
          </button>
        </form>
      )}

      {/* STEP 4: SUCCESS */}
      {step === 'success' && (
        <div className="space-y-4 text-center">
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-200">
            <p className="font-semibold">Security Update Complete</p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
              Your password has been changed. All active sessions have been invalidated for your safety.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSuccessReset(email)}
            className="w-full py-2.5 px-4 rounded-lg bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-all"
          >
            Proceed to Sign In
          </button>
        </div>
      )}
    </div>
  );
};
