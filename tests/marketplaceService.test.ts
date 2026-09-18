import { marketplaceService, FarmerProduct, BuyerDemand } from '../src/services/marketplaceService.js';

let failed = 0;
function assert(cond: boolean, desc: string) {
  if (cond) {
    console.log(`  ✓ ${desc}`);
  } else {
    console.error(`  ✗ FAIL: ${desc}`);
    failed++;
  }
}

console.log('=== KISHANSETU BIDIRECTIONAL MARKETPLACE & DEMANDS TEST SUITE ===\n');

// Test 1: Initial Default Listings and Demands Integrity
console.log('Test 1: Default Listings and Demands Integrity');
const initialProducts = marketplaceService.getProducts();
const initialDemands = marketplaceService.getDemands();
const openDemands = marketplaceService.getOpenDemands();

assert(initialProducts.length >= 4, `Initial farmer products seeded (count: ${initialProducts.length})`);
assert(initialDemands.length >= 4, `Initial buyer demands seeded (count: ${initialDemands.length})`);
assert(openDemands.length >= 4, `Initial open demands available for farmers to fulfill (count: ${openDemands.length})`);

// Test 2: Consumer vs Bulk Buyer Catalog Filtering
console.log('\nTest 2: Consumer vs Bulk Buyer Catalog Filtering');
const consumerProducts = marketplaceService.getProductsForConsumers();
const bulkProducts = marketplaceService.getProductsForBulkBuyers();

assert(consumerProducts.length > 0, `Consumer store displays active farmer products (count: ${consumerProducts.length})`);
assert(bulkProducts.length > 0, `Bulk Buyer procurement displays active farmer lots (count: ${bulkProducts.length})`);
assert(
  consumerProducts.every((p) => p.targetAudience === 'both' || p.targetAudience === 'consumer'),
  'Consumer catalog only includes items targeted to consumers or both'
);
assert(
  bulkProducts.every((p) => p.targetAudience === 'both' || p.targetAudience === 'bulk_buyer'),
  'Bulk Buyer procurement only includes items targeted to bulk buyers or both'
);

// Test 3: Farmer Submits New Produce Listing
console.log('\nTest 3: Farmer Submits New Produce Listing');
const newProduce = marketplaceService.submitProduct({
  farmerId: 'farmer-test-01',
  farmerName: 'Ramu Kaka (Test)',
  farmerContact: '+91 99999 88888',
  name: 'Farm Fresh Organic Spinach',
  hindiName: 'पालक',
  category: 'Vegetables',
  variety: 'Desi Indian Broad Leaf',
  pricePerKg: 28,
  pricePerQuintal: 2200,
  availableStockKg: 800,
  availableStockQuintals: 8,
  minOrderKg: 2,
  minOrderQuintals: 1,
  location: 'Sonepat Organic Cluster',
  state: 'Haryana',
  harvestDate: '2026-09-18',
  qualityGrade: 'Organic Certified',
  targetAudience: 'both',
  imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800',
  description: 'Zero chemical organic tender spinach leaves picked at sunrise.',
  organic: true,
});

assert(Boolean(newProduce.id), `Product submitted with ID: ${newProduce.id}`);
assert(newProduce.status === 'active', 'Product status is active upon submission');

// Check visibility across consumer and bulk catalogs
const updatedConsumerProducts = marketplaceService.getProductsForConsumers();
const updatedBulkProducts = marketplaceService.getProductsForBulkBuyers();
assert(
  updatedConsumerProducts.some((p) => p.id === newProduce.id),
  'Consumer catalog immediately reflects new farmer produce'
);
assert(
  updatedBulkProducts.some((p) => p.id === newProduce.id),
  'Bulk Buyer catalog immediately reflects new farmer produce'
);

// Test 4: Consumer and Bulk Buyer Raise Demands
console.log('\nTest 4: Buyer Demands Broadcast to Farmer Hub');
const consumerDemand = marketplaceService.raiseDemand({
  buyerId: 'consumer-usr-1',
  buyerName: 'Aarti Sharma',
  buyerType: 'consumer',
  commodity: 'Desi Country Tomatoes',
  category: 'Vegetables',
  variety: 'Local Tangy Desi',
  requiredQty: 40,
  unit: 'kg',
  offeredPrice: 38,
  deliveryLocation: 'Indirapuram, Ghaziabad, UP',
  neededByDate: '2026-09-25',
  paymentTerms: 'UPI / Cash on Delivery',
  notes: 'Needed for residential family gathering, ripe and red.',
});

assert(Boolean(consumerDemand.id), `Consumer demand raised with ID: ${consumerDemand.id}`);
assert(consumerDemand.status === 'open', 'Consumer demand is open');

const bulkDemand = marketplaceService.raiseDemand({
  buyerId: 'bulk-proc-2',
  buyerName: 'Patanjali Agro Sourcing',
  buyerType: 'bulk_buyer',
  organization: 'Patanjali Foods Ltd',
  commodity: 'Amla (Indian Gooseberry)',
  category: 'Fruits',
  variety: 'Chakaiya / Banarasi',
  requiredQty: 300,
  unit: 'quintal',
  offeredPrice: 4200,
  deliveryLocation: 'Haridwar Central Processing Plant',
  neededByDate: '2026-10-05',
  paymentTerms: 'Direct NEFT within 48h of weighbridge certification',
  notes: 'High vitamin C grade, minimum 45mm diameter.',
});

assert(Boolean(bulkDemand.id), `Bulk buyer RFQ raised with ID: ${bulkDemand.id}`);

// Verify farmer sees both demands
const openDemandsAfterRaise = marketplaceService.getOpenDemands();
assert(
  openDemandsAfterRaise.some((d) => d.id === consumerDemand.id),
  'Farmer sees the new consumer demand in Live Buyer Demands'
);
assert(
  openDemandsAfterRaise.some((d) => d.id === bulkDemand.id),
  'Farmer sees the new bulk institutional RFQ in Live Buyer Demands'
);

// Test 5: Farmer Fulfills Buyer Demand
console.log('\nTest 5: Farmer Fulfills Buyer Demand');
const fulfilled = marketplaceService.fulfillDemand(consumerDemand.id, {
  farmerId: 'farmer-test-01',
  farmerName: 'Ramu Kaka (Test)',
  committedQty: 40,
  committedRate: 38,
});

assert(fulfilled === true, 'Demand fulfillment committed successfully');
const allDemandsAfterFulfill = marketplaceService.getDemands();
const targetDemand = allDemandsAfterFulfill.find((d) => d.id === consumerDemand.id);
assert(targetDemand?.status === 'fulfilled', 'Demand status updated to fulfilled');
assert(targetDemand?.fulfilledByFarmerName === 'Ramu Kaka (Test)', 'Fulfilling farmer recorded');

const openDemandsAfterFulfill = marketplaceService.getOpenDemands();
assert(
  !openDemandsAfterFulfill.some((d) => d.id === consumerDemand.id),
  'Fulfilled demand removed from open demands list'
);

// Test 6: Farmer Product Status Update & Deletion
console.log('\nTest 6: Farmer Product Status Lifecycle');
const markedSold = marketplaceService.updateProductStatus(newProduce.id, 'sold_out');
assert(markedSold === true, 'Product status updated to sold_out');
const consumerCatalogAfterSold = marketplaceService.getProductsForConsumers();
assert(
  !consumerCatalogAfterSold.some((p) => p.id === newProduce.id),
  'Sold out product is removed from active consumer catalog'
);

const deleted = marketplaceService.deleteProduct(newProduce.id);
assert(deleted === true, 'Product deleted successfully');
const allProductsAfterDelete = marketplaceService.getProducts();
assert(
  !allProductsAfterDelete.some((p) => p.id === newProduce.id),
  'Deleted product completely removed from database'
);

console.log(`\n=== SUITE SUMMARY: ${failed === 0 ? 'ALL TESTS PASSED ✓' : `${failed} TESTS FAILED ✗`} ===`);
if (failed > 0) {
  process.exit(1);
}
