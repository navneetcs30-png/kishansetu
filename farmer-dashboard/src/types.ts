export interface CropRateItem {
  id: string;
  name: string;
  hindiName: string;
  season: 'Rabi' | 'Kharif' | 'Zaid';
  mspRate: number; // in ₹ per quintal (100 kg)
  unit: string;
  description: string;
  badge?: string;
}

export interface VegetableItem {
  id: string;
  name: string;
  hindiName: string;
  mandiRatePerQuintal: number; // ₹ per quintal (100 kg)
  typicalArrival: 'High' | 'Moderate' | 'Low';
  primaryMarket: string;
  seasonNote: string;
}

export interface GuidanceStage {
  id: string;
  stageName: string;
  hindiTitle: string;
  iconName: string;
  summary: string;
  keyPractices: {
    title: string;
    description: string;
    criticalTiming: string;
  }[];
  expertTips: string[];
  mistakesToAvoid: string[];
}

export interface GovtScheme {
  id: string;
  name: string;
  hindiName: string;
  shortAcronym: string;
  category: 'Income Support' | 'Crop Insurance' | 'Credit' | 'Soil Health' | 'Irrigation Subsidy' | 'Market Access';
  benefitAmount: string;
  summary: string;
  keyBenefits: string[];
  eligibility: string;
  officialUrl: string;
  portalName: string;
}

export type VerificationStatus = 'not_submitted' | 'pending' | 'verified' | 'rejected';

export interface FarmerDocumentSubmission {
  id: string;
  farmerName: string;
  phone: string;
  aadhaarNumber: string;
  village: string;
  district: string;
  state: string;
  landSizeAcres: number;
  documentType: 'Aadhaar Card' | 'Land Patta / Khasra' | 'Voter ID';
  documentFileName: string;
  documentFileData?: string; // base64 / object url / sample placeholder preview
  documentFileSize?: string;
  submissionDate: string;
  status: VerificationStatus;
  reviewedAt?: string;
  reviewedBy?: string;
  adminRemarks?: string;
  kisanRegistrationNumber?: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

