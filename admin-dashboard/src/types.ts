export type Role = 'Farmer' | 'Consumer' | 'Bulk Buyer' | 'Admin';

export type AccountStatus = 'Active' | 'Suspended' | 'Pending';

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  registrationDate: string;
  accountStatus: AccountStatus;
  location: string;
  activeListingsCount: number;
  completedOrdersCount: number;
  verifiedDate?: string;
  notes?: string;
  documentStatus: 'Verified' | 'Pending Review' | 'Rejected' | 'Exempt';
  lastActive: string;
  avatarSeed: string;
}

export interface SubmittedDocument {
  id: string;
  name: string;
  type: 'Land Records (7/12)' | 'Business Registration / GSTIN' | 'Government Photo ID' | 'Organic Farming Certificate' | 'Trade License / Mandi Pass';
  fileSize: string;
  uploadedAt: string;
  docNumber: string;
  issuer: string;
  status: 'Pending' | 'Verified' | 'Rejected';
}

export interface VerificationApplication {
  id: string;
  userId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  role: Role;
  organizationName?: string;
  location: string;
  submittedDocuments: SubmittedDocument[];
  submittedAt: string;
  timeWaiting: string;
  waitingHours: number;
  priority: 'Urgent' | 'Standard' | 'Elevated';
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface GuidanceTopic {
  id: string;
  title: string;
  category: 'Onboarding' | 'Escalations' | 'Moderation' | 'Data Policy';
  summary: string;
  badge: string;
  lastUpdated: string;
  checklist?: { id: string; text: string; done: boolean }[];
  content: {
    overview: string;
    protocolSteps?: string[];
    rules?: { label: string; detail: string; severity?: 'high' | 'medium' | 'info' }[];
    importantNote?: string;
    contactEscalation?: string;
  };
}

export interface PermissionItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'Marketplace' | 'Transactions' | 'Verification' | 'System' | 'Content';
}

export interface RoleConfig {
  role: Role;
  tagline: string;
  activeUserCount: number;
  pendingUserCount: number;
  suspendedUserCount: number;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  permissions: PermissionItem[];
}

export interface DashboardMetrics {
  totalUsers: number;
  pendingVerifications: number;
  activeListings: number;
  suspendedAccounts: number;
  activeFarmers: number;
  activeBulkBuyers: number;
  activeConsumers: number;
  slaBreaches?: number;
}
