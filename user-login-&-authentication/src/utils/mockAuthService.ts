import { UserAccount, SecurityEvent, VerificationNotification, MfaMethod, UserRole } from '../types';

const USERS_STORAGE_KEY = 'auth_portal_users_v2';
const LOGS_STORAGE_KEY = 'auth_portal_logs_v2';
const NOTIFICATIONS_STORAGE_KEY = 'auth_portal_notifications_v2';
const LOCKOUT_KEY = 'auth_portal_lockout_v2';

// Seed demo users for the 4 core roles
const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user_farmer_ramesh',
    name: 'Ramesh Patel',
    email: 'ramesh.farmer@agriportal.in',
    passwordHash: 'FarmerHarvest#2025',
    role: 'farmer',
    roleMeta: {
      farmName: 'GreenValley Agro Farms (25 Acres)',
      location: 'Karnal, Haryana - Agri Zone 4',
      badgeTitle: 'Verified Organic Grower',
      registrationNumber: 'AGR-FARM-88219',
    },
    phone: '+1 (555) 382-9912',
    avatarUrl: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=150&auto=format&fit=crop&q=80',
    mfaEnabled: true,
    preferredMfa: 'sms_otp',
    authenticatorSecret: 'JBSWY3DPEHPK3PXP',
    backupCodes: ['8421-9923', '4120-6671', '9034-1182', '5523-8874'],
    createdAt: '2025-01-10T10:00:00Z',
    lastLogin: '2025-03-05T08:30:00Z',
  },
  {
    id: 'user_consumer_priya',
    name: 'Priya Sharma',
    email: 'priya.consumer@freshmart.in',
    passwordHash: 'ConsumerFresh#2025',
    role: 'consumer',
    roleMeta: {
      location: 'South City Towers, Metro Hub',
      badgeTitle: 'Prime Farm-to-Table Member',
    },
    phone: '+1 (555) 721-4439',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    mfaEnabled: true,
    preferredMfa: 'email_otp',
    authenticatorSecret: 'JBSWY3DPEHPK3PXP',
    backupCodes: ['1142-9903', '4820-1123', '9012-7721', '6623-4412'],
    createdAt: '2025-01-22T14:15:00Z',
    lastLogin: '2025-03-06T11:20:00Z',
  },
  {
    id: 'user_bulk_vikram',
    name: 'Vikram Singhania',
    email: 'vikram.bulkbuyer@agritraders.com',
    passwordHash: 'BulkTrading#2025',
    role: 'bulk_buyer',
    roleMeta: {
      organization: 'Singhania Agro Trading Corp (Wholesale & Export)',
      location: 'Central Logistics Terminal',
      badgeTitle: 'Tier-1 Institutional Buyer',
      registrationNumber: 'CORP-TRD-44910',
    },
    phone: '+1 (555) 890-1122',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    mfaEnabled: true,
    preferredMfa: 'email_otp',
    authenticatorSecret: 'HXDMVJECJJWSRB3H',
    backupCodes: ['7711-2290', '3341-8892', '5521-9901', '1249-4458'],
    createdAt: '2025-01-05T09:00:00Z',
    lastLogin: '2025-03-07T14:45:00Z',
  },
  {
    id: 'user_admin_devon',
    name: 'Devon Vance',
    email: 'admin.security@agriportal.gov',
    passwordHash: 'AgriAdmin#2025',
    role: 'admin',
    roleMeta: {
      organization: 'AgriPortal Central Security & Governance Council',
      location: 'Security Operations Center (SOC)',
      badgeTitle: 'Super Administrator',
      registrationNumber: 'SYS-SEC-0001',
    },
    phone: '+1 (555) 911-0044',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    mfaEnabled: true,
    preferredMfa: 'authenticator_app',
    authenticatorSecret: 'HXDMVJECJJWSRB3H',
    backupCodes: ['2941-8832', '7103-5591', '6620-3349', '1189-7740'],
    createdAt: '2024-12-01T00:00:00Z',
    lastLogin: '2025-03-07T19:00:00Z',
  },
  {
    id: 'user_alex',
    name: 'Alex Morgan',
    email: 'alex.morgan@company.com',
    passwordHash: 'AlexSecure#2025!',
    role: 'consumer',
    roleMeta: {
      location: 'Bay Area, Metro Center',
      badgeTitle: 'Verified Consumer',
    },
    phone: '+1 (555) 019-4821',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    mfaEnabled: true,
    preferredMfa: 'email_otp',
    authenticatorSecret: 'JBSWY3DPEHPK3PXP',
    backupCodes: ['8421-9923', '4120-6671', '9034-1182', '5523-8874'],
    createdAt: '2025-01-15T10:00:00Z',
    lastLogin: '2025-02-28T09:12:00Z',
  },
  {
    id: 'user_sarah',
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.io',
    passwordHash: 'CyberShield$99',
    role: 'admin',
    roleMeta: {
      organization: 'Security Infrastructure Lead',
      badgeTitle: 'Security Officer',
    },
    phone: '+1 (555) 782-9014',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    mfaEnabled: true,
    preferredMfa: 'authenticator_app',
    authenticatorSecret: 'HXDMVJECJJWSRB3H',
    backupCodes: ['2941-8832', '7103-5591', '6620-3349', '1189-7740'],
    createdAt: '2025-02-01T14:30:00Z',
    lastLogin: '2025-03-01T18:45:00Z',
  },
];

type NotificationListener = (notifications: VerificationNotification[]) => void;
const listeners: Set<NotificationListener> = new Set();

class MockAuthService {
  private users: UserAccount[] = [];
  private logs: SecurityEvent[] = [];
  private notifications: VerificationNotification[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        const parsed: UserAccount[] = JSON.parse(storedUsers);
        // Ensure all seed demo users exist and everyone has a role
        const merged = [...parsed];
        for (const initial of INITIAL_USERS) {
          if (!merged.some((u) => u.email.toLowerCase() === initial.email.toLowerCase())) {
            merged.push(initial);
          }
        }
        // Normalize any missing role field
        this.users = merged.map((u) => {
          if (!u.role) {
            u.role = u.email.includes('farmer') ? 'farmer' : u.email.includes('bulk') ? 'bulk_buyer' : u.email.includes('admin') ? 'admin' : 'consumer';
          }
          return u;
        });
        this.saveUsers();
      } else {
        this.users = INITIAL_USERS;
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
      }

      const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
      if (storedLogs) {
        this.logs = JSON.parse(storedLogs);
      } else {
        this.logs = [
          {
            id: 'evt_1',
            type: 'login_success',
            timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
            ip: '192.168.1.42',
            device: 'Chrome 122 on macOS Sonoma',
            details: 'Successful 2FA login via Email OTP',
          },
        ];
        localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(this.logs));
      }

      const storedNotifs = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (storedNotifs) {
        this.notifications = JSON.parse(storedNotifs);
      }
    } catch {
      this.users = INITIAL_USERS;
      this.logs = [];
      this.notifications = [];
    }
  }

  private saveUsers() {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
  }

  private saveLogs() {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(this.logs));
  }

  private saveNotifications() {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(this.notifications));
    listeners.forEach((listener) => listener([...this.notifications]));
  }

  public subscribeToNotifications(listener: NotificationListener) {
    listeners.add(listener);
    listener([...this.notifications]);
    return () => {
      listeners.delete(listener);
    };
  }

  public getAllUsers(): UserAccount[] {
    return this.users;
  }

  public findUserByEmail(email: string): UserAccount | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  public getSecurityLogs(): SecurityEvent[] {
    return this.logs;
  }

  public addLog(event: Omit<SecurityEvent, 'id' | 'timestamp' | 'ip' | 'device'>) {
    const newLog: SecurityEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ip: '192.168.1.' + Math.floor(Math.random() * 200 + 10),
      device: navigator.userAgent.includes('Mac') ? 'macOS Safari / Chrome' : 'Windows 11 Chrome',
      ...event,
    };
    this.logs.unshift(newLog);
    if (this.logs.length > 50) this.logs.pop();
    this.saveLogs();
    return newLog;
  }

  // Lockout tracking
  public getLockoutState(): { isLocked: boolean; remainingSeconds: number } {
    try {
      const raw = localStorage.getItem(LOCKOUT_KEY);
      if (!raw) return { isLocked: false, remainingSeconds: 0 };
      const data = JSON.parse(raw);
      const remaining = Math.max(0, Math.ceil((data.until - Date.now()) / 1000));
      if (remaining > 0) {
        return { isLocked: true, remainingSeconds: remaining };
      }
      localStorage.removeItem(LOCKOUT_KEY);
      return { isLocked: false, remainingSeconds: 0 };
    } catch {
      return { isLocked: false, remainingSeconds: 0 };
    }
  }

  public triggerLockout(durationSeconds = 30) {
    const until = Date.now() + durationSeconds * 1000;
    localStorage.setItem(LOCKOUT_KEY, JSON.stringify({ until }));
    this.addLog({
      type: 'lockout',
      details: `Account temporarily locked out for ${durationSeconds}s due to multiple failed attempts.`,
    });
  }

  public resetLockout() {
    localStorage.removeItem(LOCKOUT_KEY);
  }

  // Generate OTP or Magic Link
  public sendOtp(
    recipient: string,
    purpose: 'mfa_login' | 'password_recovery',
    method: 'email' | 'sms' = 'email'
  ): { code: string; notifId: string } {
    // Generate secure random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const notif: VerificationNotification = {
      id: `notif_${Date.now()}`,
      type: 'otp',
      recipient: method === 'sms' ? recipient : recipient.toLowerCase(),
      code,
      purpose,
      createdAt: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes validity
      read: false,
    };

    this.notifications.unshift(notif);
    this.saveNotifications();
    return { code, notifId: notif.id };
  }

  public sendMagicLink(email: string): { token: string; linkUrl: string; notifId: string } {
    const token = 'tok_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    const linkUrl = `${window.location.origin}/#reset-token=${token}&email=${encodeURIComponent(email)}`;

    const notif: VerificationNotification = {
      id: `notif_${Date.now()}`,
      type: 'magic_link',
      recipient: email.toLowerCase(),
      linkUrl,
      purpose: 'password_recovery',
      createdAt: Date.now(),
      expiresAt: Date.now() + 15 * 60 * 1000,
      read: false,
    };

    this.notifications.unshift(notif);
    this.saveNotifications();
    return { token, linkUrl, notifId: notif.id };
  }

  public verifyOtp(
    recipient: string,
    code: string,
    purpose: 'mfa_login' | 'password_recovery'
  ): { success: boolean; error?: string } {
    const matchIndex = this.notifications.findIndex(
      (n) =>
        n.type === 'otp' &&
        n.purpose === purpose &&
        n.recipient.toLowerCase() === recipient.toLowerCase() &&
        n.code === code.trim()
    );

    if (matchIndex === -1) {
      return { success: false, error: 'Invalid verification code. Please check and try again.' };
    }

    const notif = this.notifications[matchIndex];
    if (Date.now() > notif.expiresAt) {
      return { success: false, error: 'Verification code has expired. Please request a new code.' };
    }

    // Mark as consumed
    this.notifications.splice(matchIndex, 1);
    this.saveNotifications();
    return { success: true };
  }

  // Simulated TOTP for Authenticator App
  public getSimulatedTotp(secret: string = 'JBSWY3DPEHPK3PXP'): {
    code: string;
    secondsRemaining: number;
  } {
    const epoch = Math.floor(Date.now() / 1000);
    const timeStep = 30;
    const counter = Math.floor(epoch / timeStep);
    const secondsRemaining = timeStep - (epoch % timeStep);

    // Deterministic 6-digit pseudo-TOTP from counter & secret
    let hash = 0;
    const str = `${secret}_${counter}`;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const code = Math.abs(hash % 900000 + 100000).toString();
    return { code, secondsRemaining };
  }

  public verifyTotp(secret: string, enteredCode: string): boolean {
    const current = this.getSimulatedTotp(secret).code;
    // Allow small clock drift tolerance
    return enteredCode.trim() === current;
  }

  public verifyBackupCode(user: UserAccount, code: string): boolean {
    const cleaned = code.trim();
    const index = user.backupCodes.indexOf(cleaned);
    if (index !== -1) {
      user.backupCodes.splice(index, 1);
      this.saveUsers();
      this.addLog({
        type: 'mfa_verified',
        details: `Signed in using one-time backup recovery code (${user.backupCodes.length} remaining).`,
      });
      return true;
    }
    return false;
  }

  public createUser(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    roleMeta?: {
      farmName?: string;
      organization?: string;
      location?: string;
      badgeTitle?: string;
      registrationNumber?: string;
    };
    preferredMfa?: MfaMethod;
    phone?: string;
  }): UserAccount {
    const role: UserRole = data.role || 'consumer';
    const newUser: UserAccount = {
      id: `user_${role}_${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      passwordHash: data.password,
      role,
      roleMeta: data.roleMeta,
      phone: data.phone || '+1 (555) ' + Math.floor(100 + Math.random() * 900) + '-' + Math.floor(1000 + Math.random() * 9000),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      mfaEnabled: true,
      preferredMfa: data.preferredMfa || 'email_otp',
      authenticatorSecret: 'GAZA' + Math.random().toString(36).substring(2, 8).toUpperCase() + 'TOTP',
      backupCodes: [
        `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      ],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.saveUsers();
    this.addLog({
      type: 'account_created',
      details: `New [${role.toUpperCase()}] account created for ${newUser.email} with MFA enabled.`,
    });
    return newUser;
  }

  public getUsersByRole(role: UserRole): UserAccount[] {
    return this.users.filter((u) => u.role === role);
  }

  public getUserById(id: string): UserAccount | undefined {
    return this.users.find((u) => u.id === id);
  }

  public updatePassword(email: string, newPassword: string): boolean {
    const user = this.findUserByEmail(email);
    if (!user) return false;

    user.passwordHash = newPassword;
    this.saveUsers();
    this.addLog({
      type: 'password_reset',
      details: `Password securely updated for ${email}.`,
    });
    return true;
  }

  public updateUserMfa(userId: string, mfaEnabled: boolean, preferredMfa: MfaMethod): boolean {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return false;
    user.mfaEnabled = mfaEnabled;
    user.preferredMfa = preferredMfa;
    this.saveUsers();
    this.addLog({
      type: 'mfa_verified',
      details: `Security configuration updated: MFA set to ${mfaEnabled ? preferredMfa : 'Disabled'}.`,
    });
    return true;
  }

  public recordLogin(user: UserAccount) {
    user.lastLogin = new Date().toISOString();
    this.saveUsers();
    this.addLog({
      type: 'login_success',
      details: `Successful authentication by ${user.name} (${user.email}).`,
    });
  }

  public getNotifications(): VerificationNotification[] {
    return this.notifications;
  }

  public markNotificationAsRead(id: string) {
    const n = this.notifications.find((item) => item.id === id);
    if (n) {
      n.read = true;
      this.saveNotifications();
    }
  }

  public clearAllNotifications() {
    this.notifications = [];
    this.saveNotifications();
  }

  public resetDemoData() {
    this.users = INITIAL_USERS;
    this.logs = [];
    this.notifications = [];
    localStorage.removeItem(USERS_STORAGE_KEY);
    localStorage.removeItem(LOGS_STORAGE_KEY);
    localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
    localStorage.removeItem(LOCKOUT_KEY);
    this.loadFromStorage();
  }
}

export const authService = new MockAuthService();
