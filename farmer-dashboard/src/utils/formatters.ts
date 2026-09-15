/**
 * Currency and Agricultural Unit Formatters
 */

export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === 0) {
    return '₹0';
  }
  
  // Format to Indian numbering system (e.g. 1,00,000)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: number): string {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat('en-IN').format(value);
}

export function parsePositiveFloat(input: string): number {
  const cleaned = input.replace(/[^0-9.]/g, '');
  const val = parseFloat(cleaned);
  if (isNaN(val) || val < 0) return 0;
  return Math.min(val, 1000000); // safety cap
}
