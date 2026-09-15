import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Mail, Smartphone, KeyRound, ArrowLeft, RefreshCw, AlertCircle, Copy, Check, LifeBuoy, Sparkles } from 'lucide-react';
import { UserAccount, MfaMethod } from '../types';
import { OtpInput } from './OtpInput';
import { authService } from '../utils/mockAuthService';

interface Props {
  user: UserAccount;
  onSuccessMfa: (user: UserAccount) => void;
  onCancel: () => void;
}

export const MfaVerificationModal: React.FC<Props> = ({
  user,
  onSuccessMfa,
  onCancel,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<MfaMethod>(user.preferredMfa || 'email_otp');
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [showBackupInput, setShowBackupInput] = useState(false);
  const [backupCode, setBackupCode] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [totpData, setTotpData] = useState<{ code: string; secondsRemaining: number }>({
    code: '123456',
    secondsRemaining: 30,
  });

  // Keep simulated TOTP ticking every second
  useEffect(() => {
    if (selectedMethod !== 'authenticator_app') return;
    const secret = user.authenticatorSecret || 'JBSWY3DPEHPK3PXP';
    const tick = () => {
      setTotpData(authService.getSimulatedTotp(secret));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [selectedMethod, user.authenticatorSecret]);

  // Dispatch initial OTP when entering OTP modes
  const triggerOtpDispatch = useCallback((method: 'email' | 'sms') => {
    setErrorMsg(null);
    setOtpCode('');
    setResendCooldown(30);

    const target = method === 'email' ? user.email : user.phone || '+1 (555) 019-4821';
    authService.sendOtp(target, 'mfa_login', method);
  }, [user.email, user.phone]);

  useEffect(() => {
    if (selectedMethod === 'email_otp') {
      triggerOtpDispatch('email');
    } else if (selectedMethod === 'sms_otp') {
      triggerOtpDispatch('sms');
    }
  }, [selectedMethod, triggerOtpDispatch]);

  // Cooldown interval
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  // Handle OTP verification
  const handleVerify = (codeToVerify?: string) => {
    const code = (codeToVerify || otpCode).trim();
    setErrorMsg(null);

    if (code.length !== 6) {
      setErrorMsg('Please enter the full 6-digit verification code.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);

      if (selectedMethod === 'authenticator_app') {
        const secret = user.authenticatorSecret || 'JBSWY3DPEHPK3PXP';
        const valid = authService.verifyTotp(secret, code);
        if (valid) {
          authService.recordLogin(user);
          authService.addLog({
            type: 'mfa_verified',
            details: `MFA verified using Authenticator TOTP.`,
          });
          onSuccessMfa(user);
        } else {
          setErrorMsg('Invalid TOTP authenticator code. Check your authenticator timer.');
        }
        return;
      }

      // Email or SMS OTP
      const recipient = selectedMethod === 'email_otp' ? user.email : user.phone || '+1 (555) 019-4821';
      const result = authService.verifyOtp(recipient, code, 'mfa_login');

      if (result.success) {
        authService.recordLogin(user);
        authService.addLog({
          type: 'mfa_verified',
          details: `MFA verified via ${selectedMethod === 'email_otp' ? 'Email OTP' : 'SMS Code'}.`,
        });
        onSuccessMfa(user);
      } else {
        setErrorMsg(result.error || 'Invalid code.');
      }
    }, 450);
  };

  // Verify backup recovery code
  const handleVerifyBackup = () => {
    if (!backupCode.trim()) {
      setErrorMsg('Please enter a backup recovery code.');
      return;
    }
    const success = authService.verifyBackupCode(user, backupCode.trim());
    if (success) {
      authService.recordLogin(user);
      onSuccessMfa(user);
    } else {
      setErrorMsg('Invalid or already used backup code.');
    }
  };

  // Quick auto-fill latest code helper
  const latestNotif = authService
    .getNotifications()
    .find(
      (n) =>
        n.purpose === 'mfa_login' &&
        (n.recipient.toLowerCase() === user.email.toLowerCase() ||
          n.recipient === user.phone)
    );

  const handleAutoFill = () => {
    if (selectedMethod === 'authenticator_app') {
      setOtpCode(totpData.code);
      handleVerify(totpData.code);
    } else if (latestNotif?.code) {
      setOtpCode(latestNotif.code);
      handleVerify(latestNotif.code);
    }
  };

  const copySecret = () => {
    const sec = user.authenticatorSecret || 'JBSWY3DPEHPK3PXP';
    navigator.clipboard.writeText(sec);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  return (
    <div id="mfa-challenge-card" className="w-full">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
        </button>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> 2-Step Verification
        </span>
      </div>

      <div className="text-center mb-5">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white shadow-md mb-2">
          {selectedMethod === 'email_otp' ? (
            <Mail className="w-6 h-6 text-indigo-300" />
          ) : selectedMethod === 'sms_otp' ? (
            <Smartphone className="w-6 h-6 text-teal-300" />
          ) : (
            <KeyRound className="w-6 h-6 text-amber-300" />
          )}
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Two-Factor Authentication
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Confirming sign-in for <span className="font-semibold text-slate-800 dark:text-slate-200">{user.email}</span>
        </p>
      </div>

      {/* MFA Method Switcher Pills */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs mb-5">
        <button
          type="button"
          onClick={() => {
            setSelectedMethod('email_otp');
            setShowBackupInput(false);
          }}
          className={`py-1.5 px-2 rounded-md font-medium text-[11px] transition-all flex items-center justify-center gap-1 ${
            selectedMethod === 'email_otp' && !showBackupInput
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Mail className="w-3 h-3" /> Email OTP
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedMethod('sms_otp');
            setShowBackupInput(false);
          }}
          className={`py-1.5 px-2 rounded-md font-medium text-[11px] transition-all flex items-center justify-center gap-1 ${
            selectedMethod === 'sms_otp' && !showBackupInput
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-3 h-3" /> SMS Code
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedMethod('authenticator_app');
            setShowBackupInput(false);
          }}
          className={`py-1.5 px-2 rounded-md font-medium text-[11px] transition-all flex items-center justify-center gap-1 ${
            selectedMethod === 'authenticator_app' && !showBackupInput
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <KeyRound className="w-3 h-3" /> Authenticator
        </button>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="mb-4 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Backup Code Mode */}
      {showBackupInput ? (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200">
            <p className="font-semibold flex items-center gap-1.5 mb-1">
              <LifeBuoy className="w-4 h-4 text-amber-600" /> Emergency Recovery Code
            </p>
            <p className="text-[11px] text-amber-800 dark:text-amber-300">
              Enter one of your single-use 8-character backup codes (e.g.,{' '}
              <span className="font-mono font-semibold">{user.backupCodes[0] || '8421-9923'}</span>).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
              Backup Code
            </label>
            <input
              type="text"
              value={backupCode}
              onChange={(e) => setBackupCode(e.target.value)}
              placeholder="XXXX-XXXX"
              className="w-full px-3 py-2 text-center font-mono font-bold tracking-widest text-base rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <button
            type="button"
            onClick={handleVerifyBackup}
            className="w-full py-2.5 px-4 rounded-lg bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-all"
          >
            Verify Backup Code
          </button>

          <button
            type="button"
            onClick={() => setShowBackupInput(false)}
            className="w-full text-xs text-slate-500 hover:text-slate-800 text-center block pt-1"
          >
            Return to standard 2FA
          </button>
        </div>
      ) : (
        /* Standard 6-Digit OTP / TOTP Mode */
        <div className="space-y-4">
          {/* Method Context Hint */}
          <div className="text-center text-xs text-slate-600 dark:text-slate-300">
            {selectedMethod === 'email_otp' && (
              <p>
                We sent a 6-digit code to{' '}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {user.email.replace(/(.{2})(.*)(?=@)/, '$1••••')}
                </span>
              </p>
            )}
            {selectedMethod === 'sms_otp' && (
              <p>
                We texted a 6-digit code to{' '}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {user.phone ? user.phone.slice(-4).padStart(12, '• ') : '••• ••• 4821'}
                </span>
              </p>
            )}
            {selectedMethod === 'authenticator_app' && (
              <p>Enter the 6-digit code generated by your Authenticator app.</p>
            )}
          </div>

          {/* If Authenticator App is active, provide simulated TOTP preview box */}
          {selectedMethod === 'authenticator_app' && (
            <div className="p-3 rounded-xl bg-slate-900 text-white shadow-inner text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[11px] text-slate-400 font-medium">Virtual Authenticator (TOTP)</span>
                <span className="font-mono text-[11px] text-amber-400 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> {totpData.secondsRemaining}s
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Current Valid Code:</div>
                  <div className="font-mono text-2xl font-bold tracking-widest text-emerald-400">
                    {totpData.code}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOtpCode(totpData.code);
                    handleVerify(totpData.code);
                  }}
                  className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-1 border border-slate-700"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" /> Insert Code
                </button>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>Secret: <span className="font-mono text-slate-300">{user.authenticatorSecret || 'JBSWY3DPEHPK3PXP'}</span></span>
                <button
                  type="button"
                  onClick={copySecret}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  {copiedSecret ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedSecret ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {/* Quick Auto-fill banner for Email/SMS if an OTP exists */}
          {selectedMethod !== 'authenticator_app' && latestNotif?.code && (
            <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-indigo-900 dark:text-indigo-200">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Simulated {selectedMethod === 'email_otp' ? 'Email' : 'SMS'} Code:</span>
                <span className="font-mono font-bold text-sm tracking-wider">{latestNotif.code}</span>
              </div>
              <button
                type="button"
                onClick={handleAutoFill}
                className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[11px] transition-colors"
              >
                Auto-fill
              </button>
            </div>
          )}

          {/* 6-Digit OTP Box */}
          <OtpInput
            value={otpCode}
            onChange={(val) => {
              setOtpCode(val);
              if (val.length === 6) {
                handleVerify(val);
              }
            }}
            hasError={!!errorMsg}
            disabled={isVerifying}
          />

          {/* Resend Code for Email/SMS */}
          {selectedMethod !== 'authenticator_app' && (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Didn&apos;t receive a code?</span>
              <button
                type="button"
                disabled={resendCooldown > 0}
                onClick={() => triggerOtpDispatch(selectedMethod === 'email_otp' ? 'email' : 'sms')}
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline disabled:text-slate-400 disabled:no-underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${resendCooldown > 0 ? '' : 'hover:rotate-180 transition-transform'}`} />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            id="mfa-verify-btn"
            type="button"
            disabled={isVerifying || otpCode.length !== 6}
            onClick={() => handleVerify()}
            className="w-full py-2.5 px-4 rounded-lg bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-medium text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isVerifying ? (
              <div className="w-5 h-5 border-2 border-white/30 dark:border-slate-900/30 border-t-white dark:border-t-slate-900 rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verify & Sign In</span>
              </>
            )}
          </button>

          {/* Emergency Backup Code toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              type="button"
              onClick={() => setShowBackupInput(true)}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors inline-flex items-center gap-1"
            >
              <LifeBuoy className="w-3.5 h-3.5" /> Lost access to your device? Use backup code
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
