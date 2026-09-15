import { UserRole, RoleConfig } from '../types';

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  farmer: {
    id: 'farmer',
    label: 'Farmer',
    tagline: 'Agricultural producer & crop marketplace seller',
    badge: 'Verified Producer',
    color: 'emerald',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    icon: 'Sprout',
    permissions: [
      'Publish harvest & produce listings',
      'Set farm-gate & mandi pricing',
      'Receive direct orders from consumers & bulk buyers',
      'Access local weather & soil advisory reports',
      'View government MSP & subsidy payouts',
    ],
  },
  consumer: {
    id: 'consumer',
    label: 'Consumer',
    tagline: 'Household buyer of verified fresh farm produce',
    badge: 'Farm-to-Table Shopper',
    color: 'blue',
    badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    icon: 'ShoppingBag',
    permissions: [
      'Browse farm-fresh organic catalog',
      'Direct order placement with local growers',
      'Scan QR origin & pesticide-free test certs',
      'Track temperature-controlled doorstep delivery',
      'Save favorite harvest subscriptions',
    ],
  },
  bulk_buyer: {
    id: 'bulk_buyer',
    label: 'Bulk Buyer',
    tagline: 'Wholesaler, FMCG processor & institutional buyer',
    badge: 'Tier-1 Institutional Buyer',
    color: 'amber',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    icon: 'Building2',
    permissions: [
      'Issue bulk Request For Quotes (RFQs)',
      'Procure multi-tonnage grain, spice & pulse batches',
      'Contract farming agreements & escrow payments',
      'Logistics freight dispatch & weighbridge tokens',
      'Export grade phytosanitary verification',
    ],
  },
  admin: {
    id: 'admin',
    label: 'Admin Access',
    tagline: 'Platform governance, KYC verification & security audits',
    badge: 'System Administrator',
    color: 'purple',
    badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    icon: 'ShieldCheck',
    permissions: [
      'KYC identity verification for farmers & bulk entities',
      'Platform security logs & failed attempt audit trail',
      'Marketplace price surveillance & dispute arbitration',
      'Account lockout management & 2FA overrides',
      'System-wide data export & policy enforcement',
    ],
  },
};

export const ROLES_LIST: UserRole[] = ['farmer', 'consumer', 'bulk_buyer', 'admin'];

export interface DemoRoleAccount {
  role: UserRole;
  name: string;
  email: string;
  password: string;
  roleBadge: string;
  roleSubtitle: string;
  avatarUrl: string;
  hint: string;
}

export const DEMO_ROLE_ACCOUNTS: DemoRoleAccount[] = [
  {
    role: 'farmer',
    name: 'Ramesh Patel',
    email: 'ramesh.farmer@agriportal.in',
    password: 'FarmerHarvest#2025',
    roleBadge: 'Organic Producer (25 Acres)',
    roleSubtitle: 'Punjab-Haryana Agritech Cluster',
    avatarUrl: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=150&auto=format&fit=crop&q=80',
    hint: 'Live farm listings, grain harvest & mandi bids',
  },
  {
    role: 'consumer',
    name: 'Priya Sharma',
    email: 'priya.consumer@freshmart.in',
    password: 'ConsumerFresh#2025',
    roleBadge: 'Farm-to-Table Shopper',
    roleSubtitle: 'North Metro Fresh Club',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    hint: 'Fresh produce basket, origin tracking & deliveries',
  },
  {
    role: 'bulk_buyer',
    name: 'Vikram Singhania',
    email: 'vikram.bulkbuyer@agritraders.com',
    password: 'BulkTrading#2025',
    roleBadge: 'Institutional Wholesaler',
    roleSubtitle: 'Singhania Agro Trading Corp',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    hint: 'Tonnage RFQs, wholesale contracts & logistics',
  },
  {
    role: 'admin',
    name: 'Devon Vance',
    email: 'admin.security@agriportal.gov',
    password: 'AgriAdmin#2025',
    roleBadge: 'Super Administrator',
    roleSubtitle: 'Central Security & Governance Ops',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    hint: 'KYC approval queue, system audit logs & security',
  },
];
