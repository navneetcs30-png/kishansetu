import { Commodity, PriceTier } from '../types';

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function getEffectiveRate(commodity: Commodity, qty: number): { rate: number; activeTier: PriceTier | null; discountPercent: number } {
  if (qty <= 0) {
    return {
      rate: commodity.basePricePerQuintal,
      activeTier: null,
      discountPercent: 0,
    };
  }

  // Sort tiers by minQty descending to match highest qualifying tier
  const sortedTiers = [...commodity.tiers].sort((a, b) => b.minQty - a.minQty);
  const matchingTier = sortedTiers.find((tier) => qty >= tier.minQty);

  if (matchingTier) {
    return {
      rate: matchingTier.ratePerQuintal,
      activeTier: matchingTier,
      discountPercent: matchingTier.discountPercent || 0,
    };
  }

  return {
    rate: commodity.basePricePerQuintal,
    activeTier: null,
    discountPercent: 0,
  };
}

export function getNextTierInfo(commodity: Commodity, qty: number): { nextTier: PriceTier | null; neededQty: number; savingsPerQ: number } | null {
  const currentRate = getEffectiveRate(commodity, qty).rate;
  const sortedTiersAsc = [...commodity.tiers].sort((a, b) => a.minQty - b.minQty);
  
  const nextTier = sortedTiersAsc.find((t) => t.minQty > qty);
  if (!nextTier) return null;

  return {
    nextTier,
    neededQty: nextTier.minQty - qty,
    savingsPerQ: currentRate - nextTier.ratePerQuintal,
  };
}
