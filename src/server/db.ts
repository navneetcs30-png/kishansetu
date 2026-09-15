import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export interface DatabaseUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'farmer' | 'consumer' | 'bulk_buyer';
  passwordHash: string;
  salt: string;
  roleMeta?: {
    organization?: string;
    location?: string;
    badgeTitle?: string;
    clearanceLevel?: string;
  };
  mfaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface DatabaseAuditLog {
  id: string;
  action: string;
  actor: string;
  ip?: string;
  timestamp: string;
  details: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
}

export interface DatabaseSession {
  token: string;
  userId: string;
  role: string;
  createdAt: string;
  expiresAt: string;
}

export interface DatabaseSchema {
  version: string;
  createdAt: string;
  updatedAt: string;
  users: DatabaseUser[];
  sessions: DatabaseSession[];
  auditLogs: DatabaseAuditLog[];
}

export class PlatformDatabase {
  private dbPath: string;
  private dataDir: string;
  private dbCache: DatabaseSchema | null = null;

  constructor(customPath?: string) {
    this.dataDir = customPath ? path.dirname(customPath) : path.join(process.cwd(), 'data');
    this.dbPath = customPath || path.join(this.dataDir, 'database.json');
    this.init();
  }

  private hashPassword(password: string, salt: string): string {
    return crypto.scryptSync(password, salt, 64).toString('hex');
  }

  private generateSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  public init(): DatabaseSchema {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    if (fs.existsSync(this.dbPath)) {
      try {
        const raw = fs.readFileSync(this.dbPath, 'utf8');
        this.dbCache = JSON.parse(raw);
        // Ensure admin exists in case of partial state
        if (this.dbCache && !this.dbCache.users.some(u => u.role === 'admin')) {
          this.seedAdmin();
        }
        return this.dbCache!;
      } catch (err) {
        console.warn('⚠️ Existing database file corrupted or unreadable, re-seeding default database:', err);
      }
    }

    // Initialize fresh database
    const now = new Date().toISOString();
    const adminSalt = this.generateSalt();
    const adminHash = this.hashPassword('Admin@KishanSetu2026', adminSalt);

    const initialData: DatabaseSchema = {
      version: '1.0.0',
      createdAt: now,
      updatedAt: now,
      users: [
        {
          id: 'usr_admin_001',
          username: 'admin',
          email: 'admin@kishansetu.in',
          name: 'Super Admin Devon Vance',
          role: 'admin',
          passwordHash: adminHash,
          salt: adminSalt,
          roleMeta: {
            organization: 'AgriPortal Central Security & Governance Council',
            location: 'Security Operations Center (SOC)',
            badgeTitle: 'Super Administrator',
            clearanceLevel: 'Root Clearance (Level 5)',
          },
          mfaEnabled: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'usr_farmer_001',
          username: 'ramesh.farmer',
          email: 'ramesh.farmer@agriportal.in',
          name: 'Ramesh Patel',
          role: 'farmer',
          passwordHash: this.hashPassword('FarmerHarvest#2025', this.generateSalt()),
          salt: this.generateSalt(),
          mfaEnabled: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'usr_consumer_001',
          username: 'priya.consumer',
          email: 'priya.consumer@freshmart.in',
          name: 'Priya Sharma',
          role: 'consumer',
          passwordHash: this.hashPassword('ConsumerFresh#2025', this.generateSalt()),
          salt: this.generateSalt(),
          mfaEnabled: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'usr_bulk_001',
          username: 'vikram.bulkbuyer',
          email: 'vikram.bulkbuyer@agritraders.com',
          name: 'Vikram Singhania',
          role: 'bulk_buyer',
          passwordHash: this.hashPassword('BulkTrading#2025', this.generateSalt()),
          salt: this.generateSalt(),
          mfaEnabled: true,
          createdAt: now,
          updatedAt: now,
        }
      ],
      sessions: [],
      auditLogs: [
        {
          id: 'log_' + Date.now(),
          action: 'DATABASE_INITIALIZED',
          actor: 'SYSTEM',
          timestamp: now,
          details: 'Initialized persistent database with default admin credentials (username: admin)',
          status: 'SUCCESS',
        }
      ],
    };

    this.dbCache = initialData;
    this.persist();
    return initialData;
  }

  private seedAdmin(): void {
    if (!this.dbCache) return;
    const now = new Date().toISOString();
    const adminSalt = this.generateSalt();
    const adminHash = this.hashPassword('Admin@KishanSetu2026', adminSalt);
    this.dbCache.users.push({
      id: 'usr_admin_001',
      username: 'admin',
      email: 'admin@kishansetu.in',
      name: 'Super Admin Devon Vance',
      role: 'admin',
      passwordHash: adminHash,
      salt: adminSalt,
      roleMeta: {
        organization: 'AgriPortal Central Security & Governance Council',
        location: 'Security Operations Center (SOC)',
        badgeTitle: 'Super Administrator',
        clearanceLevel: 'Root Clearance (Level 5)',
      },
      mfaEnabled: true,
      createdAt: now,
      updatedAt: now,
    });
    this.persist();
  }

  private persist(): void {
    if (!this.dbCache) return;
    this.dbCache.updatedAt = new Date().toISOString();
    fs.writeFileSync(this.dbPath, JSON.stringify(this.dbCache, null, 2), 'utf8');
  }

  public getAdminUser(): DatabaseUser | undefined {
    if (!this.dbCache) this.init();
    return this.dbCache?.users.find(u => u.role === 'admin');
  }

  public getUserByUsernameOrEmail(identifier: string): DatabaseUser | undefined {
    if (!this.dbCache) this.init();
    const clean = identifier.trim().toLowerCase();
    return this.dbCache?.users.find(
      u => u.username.toLowerCase() === clean || u.email.toLowerCase() === clean
    );
  }

  public verifyAdminCredentials(userIdOrEmail: string, candidatePassword: string): {
    success: boolean;
    user?: DatabaseUser;
    error?: string;
  } {
    if (!this.dbCache) this.init();
    const user = this.getUserByUsernameOrEmail(userIdOrEmail);

    if (!user) {
      this.logAudit('ADMIN_LOGIN_FAILED', userIdOrEmail, 'User ID or Email not found in database', 'FAILED');
      return { success: false, error: 'Invalid Admin User ID or Password' };
    }

    if (user.role !== 'admin') {
      this.logAudit('ADMIN_ACCESS_DENIED', userIdOrEmail, `User has role '${user.role}' instead of 'admin'`, 'FAILED');
      return { success: false, error: 'Unauthorized: This account does not possess administrator clearance.' };
    }

    const candidateHash = this.hashPassword(candidatePassword, user.salt);
    const candidateBuffer = Buffer.from(candidateHash, 'hex');
    const storedBuffer = Buffer.from(user.passwordHash, 'hex');

    let isValid = false;
    try {
      isValid = crypto.timingSafeEqual(candidateBuffer, storedBuffer);
    } catch {
      isValid = false;
    }

    if (!isValid) {
      this.logAudit('ADMIN_LOGIN_FAILED', user.username, 'Password mismatch for admin account', 'FAILED');
      return { success: false, error: 'Invalid Admin User ID or Password' };
    }

    // Update lastLogin
    user.lastLogin = new Date().toISOString();
    this.persist();

    this.logAudit('ADMIN_LOGIN_SUCCESS', user.username, 'Admin successfully authenticated against database', 'SUCCESS');
    return { success: true, user };
  }

  public updateAdminCredentials(
    currentAdminIdentifier: string,
    newUsername: string,
    newPassword?: string,
    newEmail?: string
  ): { success: boolean; user?: DatabaseUser; error?: string } {
    if (!this.dbCache) this.init();
    const user = this.getUserByUsernameOrEmail(currentAdminIdentifier);

    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Admin account not found.' };
    }

    if (newUsername) {
      const trimmedUsername = newUsername.trim();
      if (trimmedUsername.length < 3) {
        return { success: false, error: 'Username must be at least 3 characters long.' };
      }
      user.username = trimmedUsername;
    }

    if (newEmail) {
      user.email = newEmail.trim().toLowerCase();
    }

    if (newPassword && newPassword.trim()) {
      if (newPassword.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long.' };
      }
      user.salt = this.generateSalt();
      user.passwordHash = this.hashPassword(newPassword, user.salt);
    }

    user.updatedAt = new Date().toISOString();
    this.persist();

    this.logAudit(
      'ADMIN_CREDENTIALS_UPDATED',
      user.username,
      `Updated credentials in database. Username: ${user.username}, Password changed: ${Boolean(newPassword)}`,
      'SUCCESS'
    );

    return { success: true, user };
  }

  public createSession(userId: string, role: string): DatabaseSession {
    if (!this.dbCache) this.init();
    const token = 'ks_adm_sess_' + crypto.randomBytes(32).toString('hex');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

    const session: DatabaseSession = {
      token,
      userId,
      role,
      createdAt: now.toISOString(),
      expiresAt,
    };

    // Keep last 50 sessions
    this.dbCache!.sessions = [session, ...this.dbCache!.sessions.slice(0, 49)];
    this.persist();
    return session;
  }

  public verifySession(token: string): { valid: boolean; user?: DatabaseUser } {
    if (!this.dbCache) this.init();
    const session = this.dbCache?.sessions.find(s => s.token === token);
    if (!session) return { valid: false };

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      return { valid: false };
    }

    const user = this.dbCache?.users.find(u => u.id === session.userId);
    return { valid: true, user };
  }

  public logAudit(action: string, actor: string, details: string, status: 'SUCCESS' | 'FAILED' | 'WARNING'): void {
    if (!this.dbCache) return;
    const log: DatabaseAuditLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      action,
      actor,
      timestamp: new Date().toISOString(),
      details,
      status,
    };
    this.dbCache.auditLogs = [log, ...(this.dbCache.auditLogs || []).slice(0, 99)];
    this.persist();
  }

  public getDatabaseStats() {
    if (!this.dbCache) this.init();
    const admin = this.getAdminUser();
    let fileSize = 0;
    try {
      if (fs.existsSync(this.dbPath)) {
        fileSize = fs.statSync(this.dbPath).size;
      }
    } catch {}

    return {
      status: 'ONLINE',
      dbPath: this.dbPath,
      fileSize,
      totalUsers: this.dbCache?.users.length || 0,
      adminConfigured: Boolean(admin),
      adminUsername: admin?.username || 'admin',
      adminEmail: admin?.email || 'admin@kishansetu.in',
      version: this.dbCache?.version || '1.0.0',
      lastModified: this.dbCache?.updatedAt || new Date().toISOString(),
      activeSessions: this.dbCache?.sessions.length || 0,
    };
  }

  public getDbPath(): string {
    return this.dbPath;
  }
}

export const platformDb = new PlatformDatabase();
