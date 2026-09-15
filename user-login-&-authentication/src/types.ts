export type AuthView = 
  | 'login' 
  | 'register' 
  | 'mfa-challenge' 
  | 'recovery' 
  | 'dashboard';

export type MfaMethod = 'email_otp' | 'sms_otp' | 'authenticator_app';

export type RecoveryMethod = 'otp' | 'magic_link';

export type UserRole = 'farmer' | 'consumer' | 'bulk_buyer' | 'admin';

export interface RoleConfig {
  id: UserRole;
  label: string;
  tagline: string;
  badge: string;
  color: string;
  badgeBg: string;
  icon: string;
  permissions: string[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Plain/hashed simulation for demo
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  roleMeta?: {
    farmName?: string;
    organization?: string;
    location?: string;
    badgeTitle?: string;
    registrationNumber?: string;
  };
  mfaEnabled: boolean;
  preferredMfa: MfaMethod;
  authenticatorSecret?: string;
  backupCodes: string[];
  createdAt: string;
  lastLogin?: string;
}

export interface PasswordStrengthResult {
  score: number; // 0 to 100
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Excellent';
  color: string;
  bgColor: string;
  requirements: {
    id: string;
    label: string;
    met: boolean;
  }[];
  suggestions: string[];
  entropyBits: number;
}

export interface SecurityEvent {
  id: string;
  type: 'login_success' | 'login_failed' | 'mfa_verified' | 'password_reset' | 'account_created' | 'lockout';
  timestamp: string;
  ip: string;
  device: string;
  details: string;
}

export interface VerificationNotification {
  id: string;
  type: 'otp' | 'magic_link';
  recipient: string;
  code?: string;
  linkUrl?: string;
  purpose: 'mfa_login' | 'password_recovery';
  createdAt: number;
  expiresAt: number;
  read: boolean;
}
