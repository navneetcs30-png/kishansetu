export interface ProduceItem {
  id: string;
  name: string;
  hindiName?: string;
  category: 'Grains' | 'Vegetables' | 'Pulses & Seeds';
  variety: string;
  pricePerKg: number;
  pricePerQuintal: number;
  farmerName: string;
  location: string;
  distanceKm: number;
  harvestedDate: string;
  qualityGrade: 'Grade A+' | 'Grade A' | 'Organic Certified';
  stockKg: number;
  minOrderKg: number;
  popular?: boolean;
  organic?: boolean;
  description: string;
}

export interface CartItem {
  produceId: string;
  quantityKg: number;
}

export type OrderStatus = 'Placed' | 'Confirmed' | 'Dispatched' | 'Delivered';

export interface OrderTrackingStep {
  step: OrderStatus;
  label: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}

export interface OrderItemDetail {
  produceId: string;
  name: string;
  variety: string;
  quantityKg: number;
  pricePerKg: number;
  subtotal: number;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  expectedDeliveryDate: string;
  items: OrderItemDetail[];
  totalWeightKg: number;
  subtotalAmount: number;
  discountAmount: number;
  deliveryFee: number;
  finalAmount: number;
  status: OrderStatus;
  farmerGroup: string;
  deliveryAddress: string;
  deliverySlot: string;
  paymentMethod: string;
  trackingSteps: OrderTrackingStep[];
}

export interface GuidanceTopic {
  id: string;
  title: string;
  category: 'Freshness' | 'Seasonal' | 'Waste Reduction' | 'Bulk Buying';
  badge: string;
  summary: string;
  iconName: string;
  tips: Array<{
    heading: string;
    description: string;
    highlight?: string;
  }>;
}

export interface ConsumerScheme {
  id: string;
  type: 'offer' | 'scheme';
  title: string;
  tag: string;
  shortDesc: string;
  highlightBenefit: string;
  eligibility: string;
  agencyOrSponsor: string;
  howToClaim: string;
  officialRef: string;
  code?: string;
}
