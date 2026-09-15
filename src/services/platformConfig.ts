/**
 * KishanSetu Platform Super Admin Configuration & Sync Engine
 * Real-time centralized parameter management for all 5 modules.
 */

export interface CropMSPConfig {
  id: string;
  name: string;
  hindiName: string;
  season: string;
  mspRate: number; // in ₹ per quintal
  unit: string;
  description: string;
  badge: string;
}

export interface VegetableMandiConfig {
  id: string;
  name: string;
  hindiName: string;
  pricePerQuintal: number;
  benchmarkMandi: string;
  state: string;
  trend: 'up' | 'down' | 'stable';
  dailyChange: number;
}

export interface FarmerSchemesConfig {
  pmKisanAnnualAmount: number;
  pmKisanInstallments: number;
  pmfbyRabiPremiumPct: number;
  pmfbyKharifPremiumPct: number;
  kccInterestRatePct: number;
  kccCreditCeiling: number;
  dripIrrigationSubsidyPct: number;
}

export interface AISahayakConfig {
  modelName: string;
  temperature: number;
  fallbackKnowledgeEngineEnabled: boolean;
  systemInstructionOverride: string;
}

export interface ConsumerProduceConfig {
  id: string;
  name: string;
  hindiName: string;
  pricePerKg: number;
  category: string;
  inStock: boolean;
  organicCertified: boolean;
  farmerCooperative: string;
}

export interface ConsumerRulesConfig {
  tier1MinKg: number;
  tier1DiscountPct: number;
  tier2MinKg: number;
  tier2DiscountPct: number;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
}

export interface PromoCodeConfig {
  code: string;
  discountPct: number;
  description: string;
  active: boolean;
}

export interface BulkCommodityConfig {
  id: string;
  name: string;
  variety: string;
  basePricePerQuintal: number;
  mandiLocation: string;
  tier1MinQ: number;
  tier1DiscountPct: number;
  tier2MinQ: number;
  tier2DiscountPct: number;
  tier3MinQ: number;
  tier3DiscountPct: number;
}

export interface BulkTradePolicyConfig {
  apmcMandiCessPct: number;
  transitInsurancePct: number;
  platformEscrowFeePct: number;
  enforceMandiLicense: boolean;
  maxUnverifiedTonnageMT: number;
}

export interface SecurityPolicyConfig {
  mfaMandatoryForFarmer: boolean;
  mfaMandatoryForConsumer: boolean;
  mfaMandatoryForBulkBuyer: boolean;
  mfaMandatoryForAdmin: boolean;
  maxFailedLoginAttempts: number;
  lockoutDurationMinutes: number;
  minPasswordLength: number;
  requireSpecialCharacter: boolean;
  autoApproveDemoKYC: boolean;
}

export interface GlobalSystemConfig {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  emergencyPriceFreeze: boolean;
  announcementActive: boolean;
  announcementBanner: string;
  announcementType: 'info' | 'warning' | 'emergency' | 'success';
}

export interface ParameterChangeEvent {
  id: string;
  timestamp: string;
  category: string;
  parameterName: string;
  oldValue: string;
  newValue: string;
  adminName: string;
}

export interface PlatformSuperAdminConfig {
  farmer: {
    crops: CropMSPConfig[];
    vegetables: VegetableMandiConfig[];
    schemes: FarmerSchemesConfig;
    ai: AISahayakConfig;
  };
  consumer: {
    produce: ConsumerProduceConfig[];
    rules: ConsumerRulesConfig;
    promos: PromoCodeConfig[];
  };
  bulkBuyer: {
    commodities: BulkCommodityConfig[];
    tradePolicy: BulkTradePolicyConfig;
  };
  security: SecurityPolicyConfig;
  global: GlobalSystemConfig;
  changeLog: ParameterChangeEvent[];
}

export const DEFAULT_PLATFORM_CONFIG: PlatformSuperAdminConfig = {
  farmer: {
    crops: [
      {
        id: 'wheat',
        name: 'Wheat',
        hindiName: 'गेहूं (Gehun)',
        season: 'Rabi',
        mspRate: 2275,
        unit: 'Quintal (100 kg)',
        description: 'Central pool procurement standard FAQ grain moisture < 12%',
        badge: 'Major Rabi Crop',
      },
      {
        id: 'rice',
        name: 'Paddy / Rice (Common)',
        hindiName: 'धान (Dhan / Chawal)',
        season: 'Kharif',
        mspRate: 2183,
        unit: 'Quintal (100 kg)',
        description: 'Grade-A variant ₹2,203/qtl. Regulated purchase at APMC mandis',
        badge: 'Staple Kharif',
      },
      {
        id: 'maize',
        name: 'Maize (Corn)',
        hindiName: 'मक्का (Makka)',
        season: 'Kharif',
        mspRate: 2090,
        unit: 'Quintal (100 kg)',
        description: 'Dry grain feed and industrial starch grade benchmark',
        badge: 'Coarse Grain',
      },
      {
        id: 'mustard',
        name: 'Mustard & Rapeseed',
        hindiName: 'सरसों (Sarson)',
        season: 'Rabi',
        mspRate: 5650,
        unit: 'Quintal (100 kg)',
        description: 'Oilseed minimum support rate; basis 42% oil content standard',
        badge: 'High Value Oilseed',
      },
      {
        id: 'gram',
        name: 'Gram (Chana)',
        hindiName: 'चना (Chana / Desi)',
        season: 'Rabi',
        mspRate: 5440,
        unit: 'Quintal (100 kg)',
        description: 'Standard FAQ desi Bengal gram procured through NAFED',
        badge: 'Pulse Support',
      },
      {
        id: 'bajra',
        name: 'Pearl Millet (Bajra)',
        hindiName: 'बाजरा (Bajra)',
        season: 'Kharif',
        mspRate: 2500,
        unit: 'Quintal (100 kg)',
        description: 'Nutri-cereal procurement benchmark rate',
        badge: 'Millet Support',
      },
    ],
    vegetables: [
      {
        id: 'potato',
        name: 'Potato',
        hindiName: 'आलू (Aloo)',
        pricePerQuintal: 1450,
        benchmarkMandi: 'Agra Mandi',
        state: 'Uttar Pradesh',
        trend: 'stable',
        dailyChange: 0,
      },
      {
        id: 'onion',
        name: 'Onion',
        hindiName: 'प्याज (Pyaaz)',
        pricePerQuintal: 2100,
        benchmarkMandi: 'Lasalgaon Mandi',
        state: 'Maharashtra',
        trend: 'up',
        dailyChange: 50,
      },
      {
        id: 'tomato',
        name: 'Tomato',
        hindiName: 'टमाटर (Tamatar)',
        pricePerQuintal: 1850,
        benchmarkMandi: 'Kolar Mandi',
        state: 'Karnataka',
        trend: 'down',
        dailyChange: -40,
      },
      {
        id: 'cauliflower',
        name: 'Cauliflower',
        hindiName: 'फूलगोभी (Phoolgobhi)',
        pricePerQuintal: 1600,
        benchmarkMandi: 'Hapur Mandi',
        state: 'Uttar Pradesh',
        trend: 'stable',
        dailyChange: 0,
      },
      {
        id: 'cabbage',
        name: 'Cabbage',
        hindiName: 'पत्तागोभी (Patagobhi)',
        pricePerQuintal: 1200,
        benchmarkMandi: 'Indore Mandi',
        state: 'Madhya Pradesh',
        trend: 'down',
        dailyChange: -30,
      },
      {
        id: 'green_peas',
        name: 'Green Peas',
        hindiName: 'हरी मटर (Hari Matar)',
        pricePerQuintal: 3600,
        benchmarkMandi: 'Jabalpur Mandi',
        state: 'Madhya Pradesh',
        trend: 'up',
        dailyChange: 120,
      },
    ],
    schemes: {
      pmKisanAnnualAmount: 6000,
      pmKisanInstallments: 3,
      pmfbyRabiPremiumPct: 1.5,
      pmfbyKharifPremiumPct: 2.0,
      kccInterestRatePct: 4.0,
      kccCreditCeiling: 300000,
      dripIrrigationSubsidyPct: 55,
    },
    ai: {
      modelName: 'gemini-3.8-flash',
      temperature: 0.7,
      fallbackKnowledgeEngineEnabled: true,
      systemInstructionOverride: 'You are Kisan Sahayak, official agricultural advisor for KishanSetu.',
    },
  },
  consumer: {
    produce: [
      {
        id: 'prod-wheat-sharbati',
        name: 'Premium Sharbati Wheat (Atta Quality)',
        hindiName: 'शरबती गेहूं (MP Golden Grain)',
        pricePerKg: 38,
        category: 'Grains & Flours',
        inStock: true,
        organicCertified: true,
        farmerCooperative: 'Sehore Organic Growers Cooperative',
      },
      {
        id: 'prod-basmati-rice',
        name: 'Traditional Basmati Rice (Aged 2 Years)',
        hindiName: 'सुगंधित बासमती चावल',
        pricePerKg: 95,
        category: 'Rice & Paddy',
        inStock: true,
        organicCertified: true,
        farmerCooperative: 'Taraori Basmati Producer Society',
      },
      {
        id: 'prod-mustard-oil',
        name: 'Kachi Ghani Cold-Pressed Mustard Oil',
        hindiName: 'कच्ची घानी शुद्ध सरसों तेल',
        pricePerKg: 145,
        category: 'Edible Oils',
        inStock: true,
        organicCertified: true,
        farmerCooperative: 'Alwar Mustard Growers FPO',
      },
      {
        id: 'prod-chana-dal',
        name: 'Unpolished Desi Chana Dal',
        hindiName: 'देसी चना दाल (अनपॉलिश्ड)',
        pricePerKg: 82,
        category: 'Pulses & Dals',
        inStock: true,
        organicCertified: true,
        farmerCooperative: 'Vidarbha Pulse Growers Union',
      },
      {
        id: 'prod-potato-fresh',
        name: 'Farm-Fresh Table Potatoes (Chipsona)',
        hindiName: 'ताजा आलू (खेत से सीधा)',
        pricePerKg: 18,
        category: 'Fresh Vegetables',
        inStock: true,
        organicCertified: false,
        farmerCooperative: 'Agra Potato Farmers Consortium',
      },
      {
        id: 'prod-tomato-vine',
        name: 'Vine-Ripened Hybrid Tomatoes',
        hindiName: 'देसी लाल टमाटर (ताजा तुड़ाई)',
        pricePerKg: 28,
        category: 'Fresh Vegetables',
        inStock: true,
        organicCertified: true,
        farmerCooperative: 'Madanapalle Red Tomato FPO',
      },
    ],
    rules: {
      tier1MinKg: 25,
      tier1DiscountPct: 8,
      tier2MinKg: 100,
      tier2DiscountPct: 15,
      freeDeliveryThreshold: 500,
      standardDeliveryFee: 40,
    },
    promos: [
      {
        code: 'FRESHFARM10',
        discountPct: 10,
        description: 'Flat 10% off on all organic farm-gate orders',
        active: true,
      },
      {
        code: 'COOPBULK15',
        discountPct: 15,
        description: 'Neighborhood community pooled harvest discount',
        active: true,
      },
    ],
  },
  bulkBuyer: {
    commodities: [
      {
        id: 'comm-1',
        name: 'Grade-A Sharbati Wheat',
        variety: 'C-306 MP Heritage',
        basePricePerQuintal: 2850,
        mandiLocation: 'Khanna / Sehore Mandis',
        tier1MinQ: 50,
        tier1DiscountPct: 3.5,
        tier2MinQ: 100,
        tier2DiscountPct: 7.0,
        tier3MinQ: 250,
        tier3DiscountPct: 11.5,
      },
      {
        id: 'comm-2',
        name: 'Yellow Mustard Seed (High Oil)',
        variety: 'Pusa Bold 42% Oil Content',
        basePricePerQuintal: 5800,
        mandiLocation: 'Alwar / Bharatpur Mandis',
        tier1MinQ: 40,
        tier1DiscountPct: 3.0,
        tier2MinQ: 80,
        tier2DiscountPct: 6.0,
        tier3MinQ: 200,
        tier3DiscountPct: 9.5,
      },
      {
        id: 'comm-3',
        name: 'Export Basmati Rice 1121 Sella',
        variety: 'Pusa 1121 Parboiled',
        basePricePerQuintal: 7600,
        mandiLocation: 'Karnal / Taraori Mandis',
        tier1MinQ: 50,
        tier1DiscountPct: 4.0,
        tier2MinQ: 100,
        tier2DiscountPct: 8.0,
        tier3MinQ: 300,
        tier3DiscountPct: 12.0,
      },
      {
        id: 'comm-4',
        name: 'Nashik Red Storage Onion',
        variety: 'Garwa Rabi Late Crop',
        basePricePerQuintal: 2350,
        mandiLocation: 'Lasalgaon / Pimpalgaon Mandis',
        tier1MinQ: 50,
        tier1DiscountPct: 4.5,
        tier2MinQ: 100,
        tier2DiscountPct: 8.5,
        tier3MinQ: 200,
        tier3DiscountPct: 13.0,
      },
    ],
    tradePolicy: {
      apmcMandiCessPct: 1.5,
      transitInsurancePct: 0.8,
      platformEscrowFeePct: 0.5,
      enforceMandiLicense: false,
      maxUnverifiedTonnageMT: 10,
    },
  },
  security: {
    mfaMandatoryForFarmer: false,
    mfaMandatoryForConsumer: false,
    mfaMandatoryForBulkBuyer: true,
    mfaMandatoryForAdmin: true,
    maxFailedLoginAttempts: 4,
    lockoutDurationMinutes: 15,
    minPasswordLength: 8,
    requireSpecialCharacter: true,
    autoApproveDemoKYC: true,
  },
  global: {
    maintenanceMode: false,
    maintenanceMessage: 'System undergoing scheduled APMC server maintenance. Read-only access enabled.',
    emergencyPriceFreeze: false,
    announcementActive: true,
    announcementBanner: '🌾 KishanSetu Super Admin Notice: Minimum Support Prices (MSP 2025-26) actively synchronized with National Procurement Mandis.',
    announcementType: 'info',
  },
  changeLog: [
    {
      id: 'log-init-1',
      timestamp: new Date().toISOString(),
      category: 'System Initialization',
      parameterName: 'Baseline Parameters Established',
      oldValue: 'None',
      newValue: 'Official 2025-26 Government Benchmarks Loaded',
      adminName: 'Devon Vance (Super Admin)',
    },
  ],
};

const STORAGE_KEY = 'kishansetu_platform_super_admin_config_v1';
const EVENT_KEY = 'kishansetu_config_updated';

class PlatformConfigService {
  private config: PlatformSuperAdminConfig;
  private listeners: Array<(config: PlatformSuperAdminConfig) => void> = [];

  constructor() {
    this.config = this.loadStoredConfig();

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            this.config = JSON.parse(e.newValue);
            this.notifyListeners();
          } catch (err) {
            console.error('Failed to parse config from storage event', err);
          }
        }
      });

      window.addEventListener(EVENT_KEY, () => {
        this.config = this.loadStoredConfig();
        this.notifyListeners();
      });
    }
  }

  private loadStoredConfig(): PlatformSuperAdminConfig {
    const cloneDefaults = () => JSON.parse(JSON.stringify(DEFAULT_PLATFORM_CONFIG));
    if (typeof window === 'undefined') return cloneDefaults();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Merge with default in case new keys were added
        return {
          ...DEFAULT_PLATFORM_CONFIG,
          ...parsed,
          farmer: { ...DEFAULT_PLATFORM_CONFIG.farmer, ...(parsed.farmer || {}) },
          consumer: { ...DEFAULT_PLATFORM_CONFIG.consumer, ...(parsed.consumer || {}) },
          bulkBuyer: { ...DEFAULT_PLATFORM_CONFIG.bulkBuyer, ...(parsed.bulkBuyer || {}) },
          security: { ...DEFAULT_PLATFORM_CONFIG.security, ...(parsed.security || {}) },
          global: { ...DEFAULT_PLATFORM_CONFIG.global, ...(parsed.global || {}) },
        };
      }
    } catch (e) {
      console.warn('Using default platform config:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_PLATFORM_CONFIG));
  }

  private saveAndBroadcast(updatedBy: string = 'Devon Vance (Super Admin)') {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
      window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: this.config }));
    }
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => {
      try {
        fn(this.config);
      } catch (err) {
        console.error('Error notifying config listener', err);
      }
    });
  }

  public subscribe(fn: (config: PlatformSuperAdminConfig) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  public getConfig(): PlatformSuperAdminConfig {
    return this.config;
  }

  private recordLog(category: string, parameterName: string, oldValue: any, newValue: any, adminName: string) {
    const entry: ParameterChangeEvent = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      category,
      parameterName,
      oldValue: typeof oldValue === 'object' ? JSON.stringify(oldValue) : String(oldValue),
      newValue: typeof newValue === 'object' ? JSON.stringify(newValue) : String(newValue),
      adminName,
    };
    this.config.changeLog = [entry, ...(this.config.changeLog || []).slice(0, 49)];
  }

  // Update Farmer Parameters
  public updateFarmerCropMSP(cropId: string, newRate: number, adminName: string = 'Devon Vance (Super Admin)') {
    const crop = this.config.farmer.crops.find((c) => c.id === cropId);
    if (crop) {
      const oldRate = crop.mspRate;
      crop.mspRate = newRate;
      this.recordLog('Farmer Hub', `${crop.name} MSP Rate`, `₹${oldRate}/Q`, `₹${newRate}/Q`, adminName);
      this.saveAndBroadcast(adminName);
    }
  }

  public updateVegetableMandiPrice(vegId: string, newPrice: number, mandi?: string, adminName: string = 'Devon Vance') {
    const veg = this.config.farmer.vegetables.find((v) => v.id === vegId);
    if (veg) {
      const oldPrice = veg.pricePerQuintal;
      veg.pricePerQuintal = newPrice;
      if (mandi) veg.benchmarkMandi = mandi;
      this.recordLog('Farmer Hub', `${veg.name} Mandi Price`, `₹${oldPrice}/Q`, `₹${newPrice}/Q`, adminName);
      this.saveAndBroadcast(adminName);
    }
  }

  public updateFarmerSchemes(schemes: Partial<FarmerSchemesConfig>, adminName: string = 'Devon Vance') {
    this.recordLog('Farmer Schemes', 'Scheme Financial Subsidies', this.config.farmer.schemes, schemes, adminName);
    this.config.farmer.schemes = { ...this.config.farmer.schemes, ...schemes };
    this.saveAndBroadcast(adminName);
  }

  public updateAISettings(ai: Partial<AISahayakConfig>, adminName: string = 'Devon Vance') {
    this.recordLog('Kisan AI Assistant', 'AI Model & Prompt Settings', this.config.farmer.ai, ai, adminName);
    this.config.farmer.ai = { ...this.config.farmer.ai, ...ai };
    this.saveAndBroadcast(adminName);
  }

  // Update Consumer Parameters
  public updateConsumerProduceItem(produceId: string, updates: Partial<ConsumerProduceConfig>, adminName: string = 'Devon Vance') {
    const item = this.config.consumer.produce.find((p) => p.id === produceId);
    if (item) {
      this.recordLog('Consumer Store', `${item.name} Listing Params`, item, updates, adminName);
      Object.assign(item, updates);
      this.saveAndBroadcast(adminName);
    }
  }

  public updateConsumerRules(rules: Partial<ConsumerRulesConfig>, adminName: string = 'Devon Vance') {
    this.recordLog('Consumer Store', 'Bulk Discount & Delivery Rules', this.config.consumer.rules, rules, adminName);
    this.config.consumer.rules = { ...this.config.consumer.rules, ...rules };
    this.saveAndBroadcast(adminName);
  }

  public togglePromoCode(code: string, active: boolean, adminName: string = 'Devon Vance') {
    const promo = this.config.consumer.promos.find((p) => p.code === code);
    if (promo) {
      promo.active = active;
      this.recordLog('Consumer Store', `Promo ${code} Status`, !active, active, adminName);
      this.saveAndBroadcast(adminName);
    }
  }

  // Update Bulk Buyer Parameters
  public updateBulkCommodity(commId: string, updates: Partial<BulkCommodityConfig>, adminName: string = 'Devon Vance') {
    const comm = this.config.bulkBuyer.commodities.find((c) => c.id === commId);
    if (comm) {
      this.recordLog('Bulk Buyer B2B', `${comm.name} Pricing & Tiers`, comm, updates, adminName);
      Object.assign(comm, updates);
      this.saveAndBroadcast(adminName);
    }
  }

  public updateBulkTradePolicy(policy: Partial<BulkTradePolicyConfig>, adminName: string = 'Devon Vance') {
    this.recordLog('Bulk Buyer B2B', 'Trade Taxes, Cess & Compliance', this.config.bulkBuyer.tradePolicy, policy, adminName);
    this.config.bulkBuyer.tradePolicy = { ...this.config.bulkBuyer.tradePolicy, ...policy };
    this.saveAndBroadcast(adminName);
  }

  // Update Security Parameters
  public updateSecurityPolicy(policy: Partial<SecurityPolicyConfig>, adminName: string = 'Devon Vance') {
    this.recordLog('Security & Auth', 'Access, MFA & Lockout Policies', this.config.security, policy, adminName);
    this.config.security = { ...this.config.security, ...policy };
    this.saveAndBroadcast(adminName);
  }

  // Update Global Controls
  public updateGlobalControls(global: Partial<GlobalSystemConfig>, adminName: string = 'Devon Vance') {
    this.recordLog('Global System', 'Kill-Switches & Broadcasts', this.config.global, global, adminName);
    this.config.global = { ...this.config.global, ...global };
    this.saveAndBroadcast(adminName);
  }

  // Bulk set entire config
  public setFullConfig(newConfig: PlatformSuperAdminConfig, adminName: string = 'Devon Vance') {
    this.recordLog('Global Master', 'Full Configuration Replacement', 'Prior Config', 'New Config Snapshot', adminName);
    this.config = newConfig;
    this.saveAndBroadcast(adminName);
  }

  // Factory Reset
  public resetToFactoryDefaults(adminName: string = 'Devon Vance') {
    this.config = JSON.parse(JSON.stringify(DEFAULT_PLATFORM_CONFIG));
    this.recordLog('Global Master', 'Reset to Platform Factory Defaults', 'Custom Parameters', 'Factory Defaults', adminName);
    this.saveAndBroadcast(adminName);
  }
}

export const platformConfigService = new PlatformConfigService();

if (typeof window !== 'undefined') {
  (window as any).platformConfigService = platformConfigService;
}
