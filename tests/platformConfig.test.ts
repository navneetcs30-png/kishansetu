import { platformConfigService } from '../src/services/platformConfig.js';

let failed = 0;
function assert(cond: boolean, desc: string) {
  if (cond) {
    console.log(`  ✓ ${desc}`);
  } else {
    console.error(`  ✗ FAIL: ${desc}`);
    failed++;
  }
}

console.log('=== KISHANSETU SUPER ADMIN PLATFORM CONFIGURATION TEST SUITE ===\n');

// Test 1: Initial Default Config
console.log('Test 1: Default Configuration Integrity');
const initialConfig = platformConfigService.getConfig();
assert(initialConfig.farmer.crops.length >= 6, 'Contains all 6 default MSP crops');
assert(initialConfig.farmer.vegetables.length >= 6, 'Contains 6 default Mandi benchmark vegetables');
assert(initialConfig.consumer.produce.length >= 6, 'Contains Consumer catalog produce items');
assert(initialConfig.bulkBuyer.commodities.length >= 4, 'Contains Bulk Buyer commodities');
assert(initialConfig.security.maxFailedLoginAttempts === 4, 'Security lockout attempts default to 4');
assert(initialConfig.global.emergencyPriceFreeze === false, 'Emergency price freeze disabled by default');

// Test 2: Farmer Hub Parameter Tuning
console.log('\nTest 2: Farmer Hub Parameter Tuning');
let notificationsCount = 0;
const unsub = platformConfigService.subscribe(() => {
  notificationsCount++;
});

platformConfigService.updateFarmerCropMSP('wheat', 2450, 'Devon Vance (Super Admin)');
const updatedWheat = platformConfigService.getConfig().farmer.crops.find((c) => c.id === 'wheat');
assert(updatedWheat?.mspRate === 2450, 'Wheat MSP updated to ₹2,450 / Quintal');
assert(notificationsCount > 0, 'Subscriber received reactive notification on MSP update');

platformConfigService.updateVegetableMandiPrice('potato', 1650, 'Agra Central Mandi', 'Devon Vance');
const updatedPotato = platformConfigService.getConfig().farmer.vegetables.find((v) => v.id === 'potato');
assert(updatedPotato?.pricePerQuintal === 1650, 'Potato Mandi benchmark updated to ₹1,650 / Quintal');

// Test 3: Consumer Store Parameter Tuning
console.log('\nTest 3: Consumer Store Parameter Tuning');
platformConfigService.updateConsumerProduceItem('prod-wheat-sharbati', { pricePerKg: 42 }, 'Devon Vance');
const updatedAtta = platformConfigService.getConfig().consumer.produce.find((p) => p.id === 'prod-wheat-sharbati');
assert(updatedAtta?.pricePerKg === 42, 'Wheat Sharbati consumer price updated to ₹42 / kg');

platformConfigService.updateConsumerRules({ tier1DiscountPct: 7, tier2DiscountPct: 14 }, 'Devon Vance');
const updatedConsumer = platformConfigService.getConfig().consumer.rules;
assert(updatedConsumer.tier1DiscountPct === 7, 'Consumer bulk tier 1 discount updated to 7%');
assert(updatedConsumer.tier2DiscountPct === 14, 'Consumer bulk tier 2 discount updated to 14%');

// Test 4: Bulk Buyer Procurement Parameters
console.log('\nTest 4: Bulk Buyer Procurement Parameters');
platformConfigService.updateBulkCommodity('comm-1', { basePricePerQuintal: 2550, tier1DiscountPct: 5 }, 'Devon Vance');
const updatedComm1 = platformConfigService.getConfig().bulkBuyer.commodities.find((c) => c.id === 'comm-1');
assert(updatedComm1?.basePricePerQuintal === 2550, 'Bulk Wheat base price updated to ₹2,550');
assert(updatedComm1?.tier1DiscountPct === 5, 'Bulk Wheat Tier 1 discount updated to 5%');

platformConfigService.updateBulkTradePolicy({ apmcMandiCessPct: 1.8, transitInsurancePct: 1.0 }, 'Devon Vance');
const updatedStatutory = platformConfigService.getConfig().bulkBuyer.tradePolicy;
assert(updatedStatutory.apmcMandiCessPct === 1.8, 'APMC Mandi Cess updated to 1.8%');
assert(updatedStatutory.transitInsurancePct === 1.0, 'Transit insurance updated to 1.0%');

// Test 5: Security & MFA Policy Governance
console.log('\nTest 5: Security & MFA Policy Governance');
platformConfigService.updateSecurityPolicy({
  mfaMandatoryForFarmer: true,
  maxFailedLoginAttempts: 3,
  lockoutDurationMinutes: 45,
}, 'Devon Vance');
const updatedSecurity = platformConfigService.getConfig().security;
assert(updatedSecurity.mfaMandatoryForFarmer === true, 'MFA policy expanded to require farmer 2FA');
assert(updatedSecurity.maxFailedLoginAttempts === 3, 'Lockout attempts tightened to 3');
assert(updatedSecurity.lockoutDurationMinutes === 45, 'Lockout duration extended to 45 mins');

// Test 6: Global Emergency Freeze & Broadcast
console.log('\nTest 6: Global Emergency Freeze & Broadcast');
platformConfigService.updateGlobalControls({
  emergencyPriceFreeze: true,
  announcementActive: true,
  announcementBanner: '🚨 Super Admin Urgent Notice: Procurement Centres Active 24/7',
  announcementType: 'emergency',
}, 'Devon Vance');
const updatedGlobal = platformConfigService.getConfig().global;
assert(updatedGlobal.emergencyPriceFreeze === true, 'Emergency price freeze activated');
assert(updatedGlobal.announcementBanner.includes('Urgent Notice'), 'Global announcement broadcast set');
assert(updatedGlobal.announcementType === 'emergency', 'Banner severity set to emergency');

// Test 7: Parameter Change Log
console.log('\nTest 7: Parameter Change Log Completeness');
const changeLog = platformConfigService.getConfig().changeLog;
assert(changeLog.length >= 6, `Change log captured ${changeLog.length} events`);
const lastLog = changeLog[0];
assert(lastLog.adminName === 'Devon Vance', 'Change log records acting Super Admin');
assert(lastLog.category === 'Global System', 'Change log records correct category');
assert(typeof lastLog.timestamp === 'string', 'Change log has valid timestamp');

// Test 8: Factory Reset
console.log('\nTest 8: Factory Reset to Government Standards');
platformConfigService.resetToFactoryDefaults('Devon Vance');
const resetConfig = platformConfigService.getConfig();
const resetWheat = resetConfig.farmer.crops.find((c) => c.id === 'wheat');
assert(resetWheat?.mspRate === 2275, 'Wheat MSP reset to original default ₹2,275');
assert(resetConfig.global.emergencyPriceFreeze === false, 'Emergency price freeze reset to false');
assert(resetConfig.security.maxFailedLoginAttempts === 4, 'Security lockout reset to 4');
assert(resetConfig.changeLog[0].parameterName === 'Reset to Platform Factory Defaults', 'Change log records Factory Reset event');

unsub();

console.log('\n======================================================');
if (failed === 0) {
  console.log('✅ ALL 18 SUPER ADMIN REVENUE & PARAMETER TESTS PASSED!');
  console.log('======================================================\n');
  process.exit(0);
} else {
  console.error(`❌ ${failed} TESTS FAILED!`);
  console.log('======================================================\n');
  process.exit(1);
}
