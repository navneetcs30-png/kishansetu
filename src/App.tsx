import React, { useState, useEffect, useTransition } from 'react';
import { 
  Sprout, 
  ShoppingBag, 
  Building2, 
  ShieldCheck, 
  KeyRound, 
  LogOut, 
  Sparkles, 
  Database,
  Menu,
  X,
  Radio,
  Flame,
  AlertTriangle,
  Sun,
  Moon,
  Lock,
  Languages
} from 'lucide-react';

// Sub-modules
import AuthApp from '../user-login-&-authentication/src/App';
import FarmerApp from '../farmer-dashboard/src/App';
import ConsumerApp from '../agridirect-consumer-dashboard/src/App';
import BulkBuyerApp from '../bulk-buyer-dashboard/src/App';
import AdminApp from '../admin-dashboard/src/App';
import { AdminLoginGate } from './components/AdminLoginGate';
import { SupabaseStatusModal } from './components/SupabaseStatusModal';
import { LogoIntroSplash } from './components/LogoIntroSplash';
import { LanguageSelectionModal } from './components/LanguageSelectionModal';

// Services and types
import { platformConfigService } from './services/platformConfig';
import { authService } from '../user-login-&-authentication/src/utils/mockAuthService';
import { UserAccount, UserRole } from '../user-login-&-authentication/src/types';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';

export type ModuleType = 'auth' | 'farmer' | 'consumer' | 'bulk_buyer' | 'admin' | 'security';

function PlatformShell() {
  const { t, isLanguageModalOpen, setIsLanguageModalOpen, currentLanguageInfo } = useLanguage();
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [activeModule, setActiveModule] = useState<ModuleType>('auth');
  const [, startTransition] = useTransition();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Common Global Theme Mode State: 'light' | 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kishansetu_theme') || localStorage.getItem('farmer_dashboard_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const isDark = theme === 'dark';
      document.documentElement.classList.toggle('dark', isDark);
      document.body.classList.toggle('dark', isDark);
      localStorage.setItem('kishansetu_theme', theme);
      localStorage.setItem('farmer_dashboard_theme', theme);
      window.dispatchEvent(new CustomEvent('kishansetu_theme_changed', { detail: { theme, isDark } }));
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Super Admin Platform Config Subscription
  const [platformConfig, setPlatformConfig] = useState(() => platformConfigService.getConfig());

  useEffect(() => {
    const unsubscribe = platformConfigService.subscribe((cfg) => {
      setPlatformConfig(cfg);
    });
    return unsubscribe;
  }, []);

  // Initialize demo state on startup
  useEffect(() => {
    const allUsers = authService.getAllUsers();
    const savedUser = localStorage.getItem('kishansetu_active_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        setActiveModule(parsed.role || 'farmer');
        return;
      } catch (e) {
        console.error('Failed to parse cached session', e);
      }
    }
    // Default initial demonstration user (Ramesh Patel, Farmer)
    const defaultDemoUser = allUsers.find((u) => u.role === 'farmer') || allUsers[0];
    if (defaultDemoUser) {
      setCurrentUser(defaultDemoUser);
      setActiveModule('farmer');
    }
  }, []);

  const handleSelectUser = (user: UserAccount) => {
    startTransition(() => {
      setCurrentUser(user);
      localStorage.setItem('kishansetu_active_user', JSON.stringify(user));
      setActiveModule(user.role as ModuleType);
      setIsMobileMenuOpen(false);
    });
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem('kishansetu_active_user', JSON.stringify(user));
    setActiveModule(user.role as ModuleType);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('kishansetu_active_user');
    localStorage.removeItem('kishansetu_admin_token');
    setActiveModule('auth');
    setIsMobileMenuOpen(false);
  };

  const handleAdminLoginSuccess = (adminUser: any, token: string) => {
    const formattedAdmin: UserAccount = {
      id: adminUser.id || 'usr_admin_001',
      name: adminUser.name || 'Super Admin Devon Vance',
      email: adminUser.email || 'admin@kishansetu.in',
      passwordHash: '',
      role: 'admin',
      roleMeta: adminUser.roleMeta || {
        organization: 'AgriPortal Central Security & Governance Council',
        location: 'Security Operations Center (SOC)',
        badgeTitle: 'Super Administrator',
        clearanceLevel: 'Root Clearance (Level 5)',
      },
      phone: '+1 (555) 911-0044',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      mfaEnabled: true,
      preferredMfa: 'authenticator_app',
      authenticatorSecret: 'HXDMVJECJJWSRB3H',
      backupCodes: ['2941-8832', '7103-5591', '6620-3349', '1189-7740'],
      createdAt: adminUser.createdAt || new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    setCurrentUser(formattedAdmin);
    localStorage.setItem('kishansetu_active_user', JSON.stringify(formattedAdmin));
    localStorage.setItem('kishansetu_admin_token', token);
    setActiveModule('admin');
  };

  const handleNavigateDashboard = (role: UserRole) => {
    setActiveModule(role as ModuleType);
  };

  const allUsers = authService.getAllUsers();
  const demoPersonas = [
    { role: 'farmer', titleKey: 'persona.farmer', name: 'Ramesh Patel', icon: Sprout, color: 'text-emerald-500', badgeKey: 'persona.farmerDesc' },
    { role: 'consumer', titleKey: 'persona.consumer', name: 'Priya Sharma', icon: ShoppingBag, color: 'text-blue-500', badgeKey: 'persona.consumerDesc' },
    { role: 'bulk_buyer', titleKey: 'persona.bulkBuyer', name: 'Vikram Singhania', icon: Building2, color: 'text-amber-500', badgeKey: 'persona.bulkBuyerDesc' },
    { role: 'admin', titleKey: 'persona.admin', name: 'Devon Vance', icon: ShieldCheck, color: 'text-purple-500', badgeKey: 'persona.adminDesc' },
  ];

  return (
    <>
      {/* Animated Logo Intro Splash Screen */}
      {showSplash && <LogoIntroSplash onComplete={() => setShowSplash(false)} />}

      {/* Pre-Application Startup Language Selection Gate Modal */}
      <LanguageSelectionModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        canDismiss={true}
      />

      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        {/* Top Persistent KishanSetu Platform Navigation Header */}
        <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm transition-colors duration-200">
          
          {/* Top Ecosystem Status Banner */}
          <div className="bg-slate-100/90 dark:bg-slate-950/80 px-4 py-1.5 border-b border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2 transition-colors duration-200">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {t('app.ecosystemLive', 'KishanSetu Ecosystem Live')}:
              </span>
              <span className="text-slate-600 dark:text-slate-300 hidden sm:inline">
                {t('app.modulesBadge', '5 Integrated Modules • Single Sign-On • Real-Time Mandi Feeds')}
              </span>
              <button
                type="button"
                onClick={() => setIsSupabaseModalOpen(true)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer shadow-xs ml-1"
                title="Inspect Supabase Cloud Database & Connection Status"
              >
                <Database className="w-2.5 h-2.5" />
                <span>{t('app.supabaseCloud', 'Supabase Cloud')}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSplash(true)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 transition-all cursor-pointer shadow-xs ml-0.5"
                title="Play KishanSetu Logo Intro Animation"
              >
                <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                <span className="hidden xs:inline">{t('app.replayLogo', 'Replay Logo')}</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="text-slate-500 dark:text-slate-400 hidden md:inline">
                {t('app.quickPersona', 'Quick Persona Switcher')}:
              </span>
              <div className="flex items-center gap-1">
                {demoPersonas.map((persona) => {
                  const isSelected = currentUser?.role === persona.role;
                  const IconComponent = persona.icon;
                  const personaTitle = t(persona.titleKey, persona.name.split(' ')[0]);
                  return (
                    <button
                      key={persona.role}
                      type="button"
                      onClick={() => {
                        if (persona.role === 'admin' && currentUser?.role !== 'admin') {
                          setActiveModule('admin');
                          setIsMobileMenuOpen(false);
                        } else {
                          const matched = allUsers.find((u) => u.role === persona.role);
                          if (matched) handleSelectUser(matched);
                        }
                      }}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                      }`}
                      title={
                        persona.role === 'admin' && currentUser?.role !== 'admin'
                          ? 'Admin Access Gate (Password Required)'
                          : `Switch to ${persona.name}`
                      }
                    >
                      <IconComponent className="w-3 h-3" />
                      <span className="hidden lg:inline">{persona.name.split(' ')[0]}</span>
                      <span className="lg:hidden">{personaTitle}</span>
                      {persona.role === 'admin' && currentUser?.role !== 'admin' && (
                        <Lock className="w-2.5 h-2.5 text-amber-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Language Selector Pill in Top Bar */}
              <div className="h-3.5 w-px bg-slate-300 dark:bg-slate-700/80 mx-0.5 hidden sm:block"></div>
              <button
                type="button"
                onClick={() => setIsLanguageModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer shadow-xs"
                title={t('app.selectLanguage', 'Select Language')}
              >
                <Languages className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>{currentLanguageInfo.nativeName}</span>
                <span className="text-[9px] opacity-70 hidden xs:inline">({currentLanguageInfo.code.toUpperCase()})</span>
              </button>

              {/* Unified Single Global Theme Mode Toggle in Top Status Strip */}
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700/80 transition-all cursor-pointer shadow-xs"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span className="hidden sm:inline">{t('app.lightMode', 'Light Mode')}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3 h-3 text-indigo-500" />
                    <span className="hidden sm:inline">{t('app.darkMode', 'Dark Mode')}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main Header Strip */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveModule(currentUser ? (currentUser.role as ModuleType) : 'auth')}>
              <div 
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSplash(true);
                }}
                title="Click to replay KishanSetu Logo Intro Animation"
              >
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 dark:from-emerald-400 dark:via-teal-200 dark:to-white bg-clip-text text-transparent">
                    {t('app.title', 'KishanSetu')}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800/80">
                    {t('app.version', 'Platform v1.0')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  {t('app.subtitle', 'National Digital Agricultural Highway & Marketplace')}
                </p>
              </div>
            </div>

            {/* Module Navigation Tabs (Desktop) */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-950/70 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveModule('farmer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeModule === 'farmer'
                    ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                }`}
              >
                <Sprout className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span>{t('nav.farmerHub', 'Farmer Hub')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModule('consumer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeModule === 'consumer'
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                <span>{t('nav.consumerStore', 'Consumer Store')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModule('bulk_buyer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeModule === 'bulk_buyer'
                    ? 'bg-amber-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>{t('nav.bulkBuyer', 'B2B Bulk Buyer')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModule('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeModule === 'admin'
                    ? 'bg-purple-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                }`}
              >
                {currentUser?.role === 'admin' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                )}
                <span>{t('nav.adminConsole', 'Admin Console')}</span>
                {currentUser?.role === 'admin' ? (
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-900/90 dark:text-purple-200 dark:border-purple-700/80">
                    {t('nav.superAdmin', 'Super Admin')}
                  </span>
                ) : (
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                    {t('nav.passwordReq', 'Password Req')}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveModule('security')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeModule === 'security'
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>{t('nav.securityMfa', 'Security & 2FA')}</span>
              </button>
            </nav>

            {/* Language Selection Action in Main Navbar */}
            <button
              type="button"
              onClick={() => setIsLanguageModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:text-emerald-300 dark:border-emerald-700/60 transition-all cursor-pointer shadow-xs shrink-0"
              title={t('app.selectLanguage', 'Select Language')}
              aria-label={t('app.selectLanguage', 'Select Language')}
            >
              <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{currentLanguageInfo.nativeName}</span>
            </button>

            {/* User Session Profile Chip / Auth State */}
            <div className="flex items-center gap-2">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div 
                    className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700/80 dark:hover:bg-slate-800 transition cursor-pointer"
                    onClick={() => setActiveModule('security')}
                    title="View Profile, 2FA Settings, and Security Logs"
                  >
                    <img
                      src={currentUser.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover border border-emerald-400"
                    />
                    <div className="hidden sm:block text-left text-xs">
                      <p className="font-semibold text-slate-900 dark:text-white leading-tight">{currentUser.name}</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 capitalize font-medium">{currentUser.role.replace('_', ' ')}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-600 dark:bg-slate-800 dark:hover:bg-rose-900/60 dark:hover:text-rose-300 dark:text-slate-400 transition cursor-pointer"
                    title={t('nav.signOut', 'Sign Out')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveModule('auth')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{t('nav.signInRegister', 'Sign In / Register')}</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-3 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => { setActiveModule('farmer'); setIsMobileMenuOpen(false); }}
                  className={`p-2 rounded-lg flex items-center gap-2 ${activeModule === 'farmer' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300'}`}
                >
                  <Sprout className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span>{t('nav.farmerHub', 'Farmer Hub')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveModule('consumer'); setIsMobileMenuOpen(false); }}
                  className={`p-2 rounded-lg flex items-center gap-2 ${activeModule === 'consumer' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300'}`}
                >
                  <ShoppingBag className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  <span>{t('nav.consumerStore', 'Consumer Store')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveModule('bulk_buyer'); setIsMobileMenuOpen(false); }}
                  className={`p-2 rounded-lg flex items-center gap-2 ${activeModule === 'bulk_buyer' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300'}`}
                >
                  <Building2 className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span>{t('nav.bulkBuyer', 'B2B Bulk Buyer')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveModule('admin'); setIsMobileMenuOpen(false); }}
                  className={`p-2 rounded-lg flex items-center gap-2 ${activeModule === 'admin' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300'}`}
                >
                  {currentUser?.role === 'admin' ? (
                    <ShieldCheck className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  )}
                  <span>{t('nav.adminConsole', 'Admin Console')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveModule('security'); setIsMobileMenuOpen(false); }}
                  className={`p-2 rounded-lg flex items-center gap-2 col-span-2 ${activeModule === 'security' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300'}`}
                >
                  <KeyRound className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  <span>{t('nav.securityMfa', 'Security & 2FA')}</span>
                </button>

                {/* Mobile Language Selector Button */}
                <button
                  type="button"
                  onClick={() => { setIsLanguageModalOpen(true); setIsMobileMenuOpen(false); }}
                  className="col-span-2 p-2 rounded-lg flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:text-emerald-200 dark:border-emerald-800 font-semibold cursor-pointer"
                >
                  <Languages className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t('app.selectLanguage', 'Select Language')}: {currentLanguageInfo.nativeName} ({currentLanguageInfo.code.toUpperCase()})</span>
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Super Admin Live Broadcast Announcement Banner */}
        {platformConfig.global.announcementActive && platformConfig.global.announcementBanner && (
          <div className={`px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 border-b shadow-xs transition-all ${
            platformConfig.global.announcementType === 'emergency'
              ? 'bg-rose-950 text-rose-200 border-rose-800'
              : platformConfig.global.announcementType === 'warning'
              ? 'bg-amber-950 text-amber-200 border-amber-800'
              : 'bg-gradient-to-r from-purple-950/90 via-slate-900 to-indigo-950/90 text-purple-200 border-purple-800/80'
          }`}>
            <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse shrink-0" />
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-900 text-purple-200 border border-purple-700 shrink-0">
              {t('app.superAdminBroadcast', 'Super Admin Broadcast')}
            </span>
            <span className="text-center">{platformConfig.global.announcementBanner}</span>
          </div>
        )}

        {/* Super Admin Emergency Price Freeze Warning */}
        {platformConfig.global.emergencyPriceFreeze && (
          <div className="bg-rose-900 text-white text-xs px-4 py-1.5 flex items-center justify-center gap-2 border-b border-rose-700 font-bold animate-pulse">
            <Flame className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>{t('app.emergencyFreeze', 'EMERGENCY PRICE FREEZE ACTIVE: All spot market fluctuations locked by Super Admin authority.')}</span>
          </div>
        )}

        {/* Super Admin Maintenance Mode Notice for Non-Admins */}
        {platformConfig.global.maintenanceMode && currentUser?.role !== 'admin' && (
          <div className="bg-amber-950/90 border-b border-amber-600/80 p-3.5 text-center text-xs text-amber-200">
            <div className="max-w-2xl mx-auto flex items-center justify-center gap-2 font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{platformConfig.global.maintenanceMessage}</span>
            </div>
          </div>
        )}

        {/* Main Active Module Render */}
        <main className="flex-1">
          {activeModule === 'auth' && (
            <AuthApp
              onLoginSuccess={handleLoginSuccess}
              onNavigateDashboard={handleNavigateDashboard}
              initialUser={currentUser}
              initialView="login"
            />
          )}

          {activeModule === 'security' && (
            <div className="py-6 px-4">
              <AuthApp
                onLoginSuccess={handleLoginSuccess}
                onNavigateDashboard={handleNavigateDashboard}
                initialUser={currentUser}
                initialView="dashboard"
              />
            </div>
          )}

          {activeModule === 'farmer' && (
            <FarmerApp
              currentUser={currentUser}
              onSignOut={handleSignOut}
              onSwitchModule={(m: string) => setActiveModule(m as ModuleType)}
            />
          )}

          {activeModule === 'consumer' && (
            <ConsumerApp
              currentUser={currentUser}
              onSignOut={handleSignOut}
              onSwitchModule={(m: string) => setActiveModule(m as ModuleType)}
            />
          )}

          {activeModule === 'bulk_buyer' && (
            <BulkBuyerApp
              currentUser={currentUser}
              onSignOut={handleSignOut}
              onSwitchModule={(m: string) => setActiveModule(m as ModuleType)}
            />
          )}

          {activeModule === 'admin' && (
            currentUser?.role === 'admin' ? (
              <AdminApp
                currentUser={currentUser}
                onSignOut={handleSignOut}
                onSwitchModule={(m: string) => setActiveModule(m as ModuleType)}
              />
            ) : (
              <AdminLoginGate
                onSuccess={handleAdminLoginSuccess}
                onCancel={() => setActiveModule('farmer')}
                currentUser={currentUser}
              />
            )
          )}
        </main>

        {/* Single Unified Global KishanSetu Footer */}
        <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold text-slate-200">{t('app.title', 'KishanSetu')}</span>
              <span>• {t('footer.tagline', 'Empowering India\'s Agricultural Ecosystem from Soil to Sale')}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>{t('footer.fido2', 'FIDO2 / 2FA Encrypted')}</span>
              <span>•</span>
              <span>{t('footer.apmc', 'APMC Mandi Benchmarks')}</span>
              <span>•</span>
              <span>{t('footer.aiSahayak', 'Gemini AI Sahayak')}</span>
            </div>
          </div>
        </footer>

        {/* Supabase Cloud Connection & Setup Diagnostic Modal */}
        <SupabaseStatusModal
          isOpen={isSupabaseModalOpen}
          onClose={() => setIsSupabaseModalOpen(false)}
        />
      </div>
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <PlatformShell />
    </LanguageProvider>
  );
}
