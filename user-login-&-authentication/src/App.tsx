import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AuthView, UserAccount, UserRole } from './types';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { MfaVerificationModal } from './components/MfaVerificationModal';
import { PasswordRecoveryModal } from './components/PasswordRecoveryModal';
import { UserProfileDashboard } from './components/UserProfileDashboard';
import { VirtualInboxDrawer } from './components/VirtualInboxDrawer';
import { Shield, Lock, CheckCircle, RefreshCw } from 'lucide-react';
import { authService } from './utils/mockAuthService';

export interface AuthAppProps {
  onLoginSuccess?: (user: UserAccount) => void;
  onNavigateDashboard?: (role: UserRole) => void;
  initialUser?: UserAccount | null;
  initialView?: AuthView;
}

export default function App({
  onLoginSuccess,
  onNavigateDashboard,
  initialUser,
  initialView = 'login'
}: AuthAppProps = {}) {
  const [view, setView] = useState<AuthView>(initialUser ? 'dashboard' : initialView);
  const [pendingUser, setPendingUser] = useState<UserAccount | null>(null);
  const [authenticatedUser, setAuthenticatedUser] = useState<UserAccount | null>(initialUser || null);
  const [recoveryEmail, setRecoveryEmail] = useState<string>('');
  const [globalBanner, setGlobalBanner] = useState<string | null>(null);

  // Sync initialUser if updated from parent
  useEffect(() => {
    if (initialUser) {
      setAuthenticatedUser(initialUser);
      setView('dashboard');
    }
  }, [initialUser]);

  // Check URL hash for magic link reset tokens
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.includes('reset-token=')) {
        const matchEmail = hash.match(/email=([^&]+)/);
        const email = matchEmail ? decodeURIComponent(matchEmail[1]) : '';
        setRecoveryEmail(email);
        setView('recovery');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Show temporary feedback banner
  const showBanner = (msg: string) => {
    setGlobalBanner(msg);
    setTimeout(() => setGlobalBanner(null), 4000);
  };

  // Login credentials verified -> route to MFA challenge or straight to dashboard if MFA disabled
  const handleSuccessCredentials = (user: UserAccount) => {
    if (user.mfaEnabled) {
      setPendingUser(user);
      setView('mfa-challenge');
    } else {
      authService.recordLogin(user);
      setAuthenticatedUser(user);
      setView('dashboard');
      showBanner(`Welcome back, ${user.name}!`);
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
    }
  };

  // MFA verified successfully
  const handleSuccessMfa = (user: UserAccount) => {
    setPendingUser(null);
    setAuthenticatedUser(user);
    setView('dashboard');
    showBanner(`Authentication successful. Welcome, ${user.name}!`);
    if (onLoginSuccess) {
      onLoginSuccess(user);
    }
  };

  // Registration complete
  const handleSuccessRegister = (user: UserAccount) => {
    showBanner(`Account created! Multi-factor verification setup complete.`);
    setPendingUser(user);
    setView('mfa-challenge');
  };

  // Password reset finished
  const handleSuccessReset = (email: string) => {
    showBanner('Password updated successfully. Please sign in with your new password.');
    setView('login');
    window.location.hash = '';
  };

  const handleSignOut = () => {
    setAuthenticatedUser(null);
    setPendingUser(null);
    setView('login');
    showBanner('You have been securely signed out.');
  };

  const handleResetData = () => {
    authService.resetDemoData();
    setAuthenticatedUser(null);
    setPendingUser(null);
    setView('login');
    showBanner('Demo database and audit logs reset to original state.');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                SecureAuth
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                Portal v2.4
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>TLS 256-Bit Encrypted</span>
            </div>

            <button
              type="button"
              onClick={handleResetData}
              title="Reset accounts and logs to demo defaults"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1 text-[11px]"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Global Notification Toast */}
      {globalBanner && (
        <div className="bg-slate-900 text-white text-xs py-2 px-4 text-center font-medium shadow flex items-center justify-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>{globalBanner}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className={`w-full transition-all duration-200 ${view === 'dashboard' ? 'max-w-3xl' : 'max-w-xl'}`}>
          <AnimatePresence mode="wait">
            {view === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="w-full p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl"
              >
                <LoginForm
                  onSuccessCredentials={handleSuccessCredentials}
                  onNavigateRegister={() => setView('register')}
                  onNavigateRecovery={(email) => {
                    setRecoveryEmail(email || '');
                    setView('recovery');
                  }}
                />
              </motion.div>
            )}

            {view === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="w-full p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl"
              >
                <RegisterForm
                  onSuccessRegister={handleSuccessRegister}
                  onNavigateLogin={() => setView('login')}
                />
              </motion.div>
            )}

            {view === 'mfa-challenge' && pendingUser && (
              <motion.div
                key="mfa"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="w-full p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl"
              >
                <MfaVerificationModal
                  user={pendingUser}
                  onSuccessMfa={handleSuccessMfa}
                  onCancel={() => {
                    setPendingUser(null);
                    setView('login');
                  }}
                />
              </motion.div>
            )}

            {view === 'recovery' && (
              <motion.div
                key="recovery"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="w-full p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl"
              >
                <PasswordRecoveryModal
                  initialEmail={recoveryEmail}
                  onSuccessReset={handleSuccessReset}
                  onCancel={() => setView('login')}
                />
              </motion.div>
            )}

            {view === 'dashboard' && authenticatedUser && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="w-full max-w-3xl -mx-auto"
              >
                <UserProfileDashboard
                  user={authenticatedUser}
                  onSignOut={handleSignOut}
                  onTriggerRecoveryDemo={() => {
                    setRecoveryEmail(authenticatedUser.email);
                    setView('recovery');
                  }}
                  onLaunchDashboard={onNavigateDashboard}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>



      {/* Virtual Security Inbox Drawer for preview testability */}
      <VirtualInboxDrawer />
    </div>
  );
}
