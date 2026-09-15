export interface PriceTier {
  minQty: number; // in quintals (Q)
  maxQty?: number; // undefined means and above
  ratePerQuintal: number; // in INR ₹
  discountPercent?: number;
}

export interface Commodity {
  id: string;
  name: string;
  category: 'Grains & Cereals' | 'Vegetables & Tubers' | 'Pulses & Oilseeds';
  variety: string;
  origin: string; // e.g., "Karnal, Haryana" or "Nashik, Maharashtra"
  fpoSupplier: string; // Farmer Producer Organization / Group
  availableStockQuintals: number;
  minOrderQuantity: number; // MOQ in quintals
  grade: string; // e.g., "Agmark Grade A", "Sortex Clean 99.5%"
  harvestDate: string;
  moistureContent: string;
  basePricePerQuintal: number;
  tiers: PriceTier[];
  imageUrl: string;
  storageType: string; // "Dry Silo Warehouse", "Cold Storage (2-4°C)"
}

export interface CartItem {
  commodityId: string;
  quantityQuintals: number;
}

export type OrderStatus = 'Requested' | 'Quoted' | 'Confirmed' | 'In Transit' | 'Delivered';

export interface ContractOrder {
  id: string;
  contractRef: string;
  supplierGroup: string;
  item: string;
  variety: string;
  quantityQuintals: number;
  agreedRatePerQuintal: number;
  totalValue: number;
  status: OrderStatus;
  orderDate: string;
  deliveryTimeline: string;
  destinationMandi: string;
  nearingDelivery?: boolean;
  actionRequired?: string;
  vehicleNo?: string;
  driverContact?: string;
  eWayBillNo?: string;
  inspectionStatus?: 'Pending' | 'Passed Grade A' | 'Awaiting Weighbridge';
}

export interface GuidanceTopic {
  id: string;
  title: string;
  category: 'Quality Grading' | 'Seasonal Calendar' | 'Storage & Logistics' | 'FPO Negotiation';
  summary: string;
  keyPoints: string[];
  metricsOrSpecs?: { label: string; value: string; tolerance: string }[];
  seasonalTimeline?: { month: string; peakSupply: boolean; priceTrend: 'Low' | 'Moderate' | 'High' }[];
  recommendation: string;
}

export interface TradeScheme {
  id: string;
  title: string;
  shortTag: string;
  authority: string;
  shortDescription: string;
  benefits: string[];
  eligibility: string;
  keyLinkText: string;
  complianceNotes: string;
  statusBadge?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  fileSize: string;
  fileType: string;
  uploadedAt: string;
  documentNumber: string;
  status: 'Verified' | 'Pending Review' | 'Uploaded';
  previewUrl?: string;
}

export interface OrganizationVerification {
  companyName: string;
  tradeName: string;
  gstin: string;
  panNumber: string;
  mandiLicenseNo: string;
  fssaiLicenseNo: string;
  overallStatus: 'Verified' | 'Pending Verification' | 'Documents Required';
  gstDocument: DocumentItem | null;
  licenseDocument: DocumentItem | null;
  fssaiDocument: DocumentItem | null;
  verifiedAt?: string;
  tier: 'Level 1: Unverified' | 'Level 2: Mandi Verified' | 'Level 3: Prime Institutional Escrow';
  creditLimit: number;
}

