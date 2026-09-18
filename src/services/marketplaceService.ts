/**
 * KishanSetu Bidirectional Marketplace Service
 * Connects Farmer Produce Submissions with Consumer & Bulk Buyer Catalogs,
 * and broadcasts Consumer & Bulk Buyer Demands to Farmers for direct fulfillment.
 */

export interface FarmerProduct {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerContact?: string;
  name: string;
  hindiName?: string;
  category: 'Grains' | 'Vegetables' | 'Pulses & Seeds' | 'Fruits' | 'Oilseeds';
  variety: string;
  pricePerKg: number;
  pricePerQuintal: number;
  availableStockKg: number;
  availableStockQuintals: number;
  minOrderKg: number;
  minOrderQuintals: number;
  location: string;
  state: string;
  harvestDate: string;
  qualityGrade: 'Grade A+' | 'Grade A' | 'Organic Certified' | 'Agmark Premium';
  targetAudience: 'both' | 'consumer' | 'bulk_buyer';
  imageUrl: string;
  description: string;
  organic?: boolean;
  createdAt: string;
  status: 'active' | 'sold_out';
}

export interface BuyerDemand {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerType: 'consumer' | 'bulk_buyer';
  organization?: string;
  commodity: string;
  category: 'Grains' | 'Vegetables' | 'Pulses & Seeds' | 'Fruits' | 'Oilseeds';
  variety?: string;
  requiredQty: number;
  unit: 'kg' | 'quintal';
  offeredPrice: number; // in INR per unit (per kg or per quintal)
  deliveryLocation: string;
  neededByDate: string;
  paymentTerms: string;
  notes?: string;
  status: 'open' | 'fulfilled';
  createdAt: string;
  fulfilledByFarmerId?: string;
  fulfilledByFarmerName?: string;
  committedQty?: number;
  committedRate?: number;
}

const STORAGE_KEY_PRODUCTS = 'kishansetu_farmer_products';
const STORAGE_KEY_DEMANDS = 'kishansetu_buyer_demands';

const DEFAULT_FARMER_PRODUCTS: FarmerProduct[] = [
  {
    id: 'prod-farm-101',
    farmerId: 'sub-farmer-01',
    farmerName: 'Ramesh Patel',
    farmerContact: '+91 98260 11422',
    name: 'Sharbati Golden Wheat',
    hindiName: 'शरबती गेहूं',
    category: 'Grains',
    variety: 'C-306 Sehore Gold',
    pricePerKg: 32,
    pricePerQuintal: 2550,
    availableStockKg: 5000,
    availableStockQuintals: 50,
    minOrderKg: 20,
    minOrderQuintals: 5,
    location: 'Sehore Mandi, MP',
    state: 'Madhya Pradesh',
    harvestDate: '2026-09-12',
    qualityGrade: 'Grade A+',
    targetAudience: 'both',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
    description: 'Authentic Malwa Sehore Sharbati wheat, direct farm harvest, sun-dried on cement threshing floor, 0% foreign matter.',
    organic: true,
    createdAt: '2026-09-15T08:30:00.000Z',
    status: 'active',
  },
  {
    id: 'prod-farm-102',
    farmerId: 'sub-farmer-02',
    farmerName: 'Gurpreet Singh',
    farmerContact: '+91 98140 77319',
    name: 'Basmati Paddy 1121',
    hindiName: 'बासमती धान',
    category: 'Grains',
    variety: 'Pusa 1121 Extra Long',
    pricePerKg: 46,
    pricePerQuintal: 3800,
    availableStockKg: 12000,
    availableStockQuintals: 120,
    minOrderKg: 25,
    minOrderQuintals: 10,
    location: 'Karnal Mandi, Haryana',
    state: 'Haryana',
    harvestDate: '2026-09-14',
    qualityGrade: 'Agmark Premium',
    targetAudience: 'both',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    description: 'Grain length 8.4mm, aroma certified, moisture <11.5%, direct from fertile GT Road alluvial belt.',
    organic: false,
    createdAt: '2026-09-16T11:00:00.000Z',
    status: 'active',
  },
  {
    id: 'prod-farm-103',
    farmerId: 'sub-farmer-03',
    farmerName: 'Dattatray Shinde',
    farmerContact: '+91 94222 55801',
    name: 'Nashik Red Onion',
    hindiName: 'नासिक लाल प्याज',
    category: 'Vegetables',
    variety: 'Garwa Winter Red (50-60mm)',
    pricePerKg: 26,
    pricePerQuintal: 2250,
    availableStockKg: 8000,
    availableStockQuintals: 80,
    minOrderKg: 10,
    minOrderQuintals: 5,
    location: 'Lasalgaon Mandi, Nashik',
    state: 'Maharashtra',
    harvestDate: '2026-09-16',
    qualityGrade: 'Grade A',
    targetAudience: 'both',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80',
    description: 'Naturally cured 3-skin tight layered red onion, long shelf life, loaded in 50kg aerated mesh bags.',
    organic: false,
    createdAt: '2026-09-16T14:20:00.000Z',
    status: 'active',
  },
  {
    id: 'prod-farm-104',
    farmerId: 'sub-farmer-01',
    farmerName: 'Ramesh Patel',
    farmerContact: '+91 98260 11422',
    name: 'Kolar Red Tomatoes',
    hindiName: 'ताज़ा देशी टमाटर',
    category: 'Vegetables',
    variety: 'Abhinav Hybrid Firm',
    pricePerKg: 24,
    pricePerQuintal: 1950,
    availableStockKg: 2500,
    availableStockQuintals: 25,
    minOrderKg: 5,
    minOrderQuintals: 2,
    location: 'Indore Mandi, MP',
    state: 'Madhya Pradesh',
    harvestDate: '2026-09-17',
    qualityGrade: 'Grade A+',
    targetAudience: 'consumer',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
    description: 'Farm fresh morning plucked firm red tomatoes. High lycopene, rich pulp, excellent for fresh household kitchens.',
    organic: true,
    createdAt: '2026-09-17T06:00:00.000Z',
    status: 'active',
  },
  {
    id: 'prod-farm-105',
    farmerId: 'sub-farmer-04',
    farmerName: 'Harpreet Gill',
    farmerContact: '+91 97800 33410',
    name: 'Yellow Mustard (Pili Sarson)',
    hindiName: 'पीली सरसों',
    category: 'Oilseeds',
    variety: 'Pusa Bold High-Oil',
    pricePerKg: 68,
    pricePerQuintal: 5900,
    availableStockKg: 15000,
    availableStockQuintals: 150,
    minOrderKg: 50,
    minOrderQuintals: 10,
    location: 'Bathinda APMC, Punjab',
    state: 'Punjab',
    harvestDate: '2026-09-10',
    qualityGrade: 'Agmark Premium',
    targetAudience: 'bulk_buyer',
    imageUrl: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=800&auto=format&fit=crop&q=80',
    description: 'Oil content > 41.5%, machine cleaned and sortex graded, packed in standard 50kg gunny bags for oil extraction mills.',
    organic: false,
    createdAt: '2026-09-15T09:15:00.000Z',
    status: 'active',
  }
];

const DEFAULT_BUYER_DEMANDS: BuyerDemand[] = [
  {
    id: 'dem-bulk-201',
    buyerId: 'usr_bulk_001',
    buyerName: 'Vikram Singhania',
    buyerType: 'bulk_buyer',
    organization: 'Singhania Roller Flour & Agro Mills Ltd.',
    commodity: 'Sharbati Wheat',
    category: 'Grains',
    variety: 'Lokwan or Sehore Gold',
    requiredQty: 400,
    unit: 'quintal',
    offeredPrice: 2500, // ₹2,500 / Qtl (Higher than MSP ₹2,275)
    deliveryLocation: 'Silo Depot 4, Pithampur Industrial Corridor, MP',
    neededByDate: '2026-09-25',
    paymentTerms: '100% RTGS Direct Bank Transfer within 48h of weighbridge test',
    notes: 'Moisture must be under 12%, minimum hectolitre weight 78 kg/hl. We will arrange multi-axle trucks directly at farm gate if quantity exceeds 200Q.',
    status: 'open',
    createdAt: '2026-09-17T09:00:00.000Z',
  },
  {
    id: 'dem-cons-202',
    buyerId: 'usr_cons_001',
    buyerName: 'Priya Sharma',
    buyerType: 'consumer',
    organization: 'Green Valley Resident Welfare Society (120 Families)',
    commodity: 'Fresh Desi Potato (Agra Chipsona)',
    category: 'Vegetables',
    variety: 'Chipsona / Pukhraj Fresh Harvest',
    requiredQty: 450,
    unit: 'kg',
    offeredPrice: 20, // ₹20 / kg (Higher than Mandi ₹14.50/kg)
    deliveryLocation: 'Community Center, Sector 45, Gurugram, Haryana',
    neededByDate: '2026-09-22',
    paymentTerms: 'Immediate UPI Payment upon doorstep delivery',
    notes: 'Direct farm-fresh supply needed for weekend residential community distribution. Medium to large size tubers preferred, unwashed dry soil packing.',
    status: 'open',
    createdAt: '2026-09-17T10:30:00.000Z',
  },
  {
    id: 'dem-bulk-203',
    buyerId: 'usr_bulk_002',
    buyerName: 'Adani Wilmar Agri Sourcing Desk',
    buyerType: 'bulk_buyer',
    organization: 'Fortune Agro Procurement Consortium',
    commodity: 'Mustard Seeds (Sarson)',
    category: 'Oilseeds',
    variety: 'High-Erucic Mustard Seed',
    requiredQty: 800,
    unit: 'quintal',
    offeredPrice: 5850, // ₹5,850 / Qtl (Above MSP ₹5,650)
    deliveryLocation: 'Alwar APMC Receiving Terminal, Rajasthan',
    neededByDate: '2026-09-30',
    paymentTerms: 'Bank Guarantee Backed APMC Mandi e-Payment within 24 hours',
    notes: 'Direct farmer lots welcome. Minimum 40% lab oil yield test required. Quality bonus ₹50/Qtl for lots exceeding 41.5% oil.',
    status: 'open',
    createdAt: '2026-09-17T11:45:00.000Z',
  },
  {
    id: 'dem-cons-204',
    buyerId: 'usr_cons_002',
    buyerName: 'Organic Kitchen Consumers Co-op',
    buyerType: 'consumer',
    organization: 'Malabar Hill Organic Consumers Hub',
    commodity: 'Organic Certified Tomatoes',
    category: 'Vegetables',
    variety: 'Country Native / Desi Tamatar',
    requiredQty: 180,
    unit: 'kg',
    offeredPrice: 35, // ₹35 / kg (Premium organic pricing)
    deliveryLocation: 'Distribution Center, Dadar West, Mumbai, MH',
    neededByDate: '2026-09-21',
    paymentTerms: 'Instant Digital Payment on delivery scan',
    notes: 'Strictly pesticide-free with natural aroma. Desi variety with tangy taste preferred over hard hybrid.',
    status: 'open',
    createdAt: '2026-09-17T13:00:00.000Z',
  }
];

class MarketplaceService {
  private products: FarmerProduct[] = [];
  private demands: BuyerDemand[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadInitialData();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY_PRODUCTS || e.key === STORAGE_KEY_DEMANDS) {
          this.loadInitialData();
          this.notify();
        }
      });
    }
  }

  private loadInitialData(): void {
    if (typeof window === 'undefined') {
      this.products = [...DEFAULT_FARMER_PRODUCTS];
      this.demands = [...DEFAULT_BUYER_DEMANDS];
      return;
    }

    try {
      const storedProducts = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (storedProducts) {
        this.products = JSON.parse(storedProducts);
      } else {
        this.products = [...DEFAULT_FARMER_PRODUCTS];
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(this.products));
      }
    } catch (e) {
      this.products = [...DEFAULT_FARMER_PRODUCTS];
    }

    try {
      const storedDemands = localStorage.getItem(STORAGE_KEY_DEMANDS);
      if (storedDemands) {
        this.demands = JSON.parse(storedDemands);
      } else {
        this.demands = [...DEFAULT_BUYER_DEMANDS];
        localStorage.setItem(STORAGE_KEY_DEMANDS, JSON.stringify(this.demands));
      }
    } catch (e) {
      this.demands = [...DEFAULT_BUYER_DEMANDS];
    }
  }

  private saveProducts(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(this.products));
      window.dispatchEvent(new CustomEvent('kishansetu_marketplace_updated'));
    }
    this.notify();
  }

  private saveDemands(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_DEMANDS, JSON.stringify(this.demands));
      window.dispatchEvent(new CustomEvent('kishansetu_demands_updated'));
    }
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error('Listener error in MarketplaceService:', e);
      }
    });
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  // --- Farmer Product Operations ---
  public getProducts(): FarmerProduct[] {
    return [...this.products];
  }

  public getProductsForConsumers(): FarmerProduct[] {
    return this.products.filter(
      (p) => p.status === 'active' && (p.targetAudience === 'both' || p.targetAudience === 'consumer')
    );
  }

  public getProductsForBulkBuyers(): FarmerProduct[] {
    return this.products.filter(
      (p) => p.status === 'active' && (p.targetAudience === 'both' || p.targetAudience === 'bulk_buyer')
    );
  }

  public getProductsByFarmer(farmerId: string): FarmerProduct[] {
    return this.products.filter((p) => p.farmerId === farmerId);
  }

  public submitProduct(
    productData: Omit<FarmerProduct, 'id' | 'createdAt' | 'status'>
  ): FarmerProduct {
    const newProduct: FarmerProduct = {
      ...productData,
      id: `prod-farm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    this.products = [newProduct, ...this.products];
    this.saveProducts();
    return newProduct;
  }

  public updateProductStatus(id: string, status: 'active' | 'sold_out'): boolean {
    const item = this.products.find((p) => p.id === id);
    if (!item) return false;
    item.status = status;
    this.saveProducts();
    return true;
  }

  public deleteProduct(id: string): boolean {
    const prevLength = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    if (this.products.length !== prevLength) {
      this.saveProducts();
      return true;
    }
    return false;
  }

  // --- Buyer Demand Operations ---
  public getDemands(): BuyerDemand[] {
    return [...this.demands];
  }

  public getOpenDemands(): BuyerDemand[] {
    return this.demands.filter((d) => d.status === 'open');
  }

  public raiseDemand(
    demandData: Omit<BuyerDemand, 'id' | 'createdAt' | 'status'>
  ): BuyerDemand {
    const newDemand: BuyerDemand = {
      ...demandData,
      id: `dem-${demandData.buyerType === 'bulk_buyer' ? 'bulk' : 'cons'}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      status: 'open',
    };

    this.demands = [newDemand, ...this.demands];
    this.saveDemands();
    return newDemand;
  }

  public fulfillDemand(
    demandId: string,
    fulfillment: {
      farmerId: string;
      farmerName: string;
      committedQty: number;
      committedRate: number;
    }
  ): boolean {
    const demand = this.demands.find((d) => d.id === demandId);
    if (!demand) return false;

    demand.status = 'fulfilled';
    demand.fulfilledByFarmerId = fulfillment.farmerId;
    demand.fulfilledByFarmerName = fulfillment.farmerName;
    demand.committedQty = fulfillment.committedQty;
    demand.committedRate = fulfillment.committedRate;

    this.saveDemands();
    return true;
  }
}

export const marketplaceService = new MarketplaceService();
