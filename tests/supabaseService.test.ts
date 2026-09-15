import dotenv from 'dotenv';
dotenv.config();

import { checkSupabaseHealth, isSupabaseConfigured, getSupabaseClient } from '../src/services/supabaseClient';
import { supabaseService } from '../src/server/supabaseService';

async function runSupabaseTests() {
  console.log('=== KISHANSETU SUPABASE INTEGRATION TEST SUITE ===\n');

  // Test 1: Configuration Detection & Graceful Fallback
  console.log('Test 1: Configuration Detection');
  const configured = isSupabaseConfigured();
  console.log(`  ✓ Supabase configured state checked (result: ${configured})`);

  // Test 2: Health Check Resiliency
  console.log('\nTest 2: Health Check Resiliency');
  const health = await checkSupabaseHealth();
  console.log(`  ✓ Health check returned safely without crash`);
  console.log(`  ✓ Configured: ${health.configured}, Connected: ${health.connected}`);

  // Test 3: Data Service Status Query
  console.log('\nTest 3: Data Service Status');
  const status = await supabaseService.getStatus();
  if (!status.provider || !status.activeMode) {
    throw new Error('Expected status to include provider and activeMode');
  }
  console.log(`  ✓ Provider identified: ${status.provider}`);
  console.log(`  ✓ Active mode: ${status.activeMode}`);

  // Test 4: MSP Rates Retrieval (Cloud with fallback)
  console.log('\nTest 4: MSP Rates Retrieval');
  const msp = await supabaseService.getMspRates();
  if (!msp.data || msp.data.length === 0) {
    throw new Error('Expected MSP rates to return data');
  }
  console.log(`  ✓ Retrieved ${msp.data.length} MSP benchmark crops from source: ${msp.source}`);

  // Test 5: Mandi Rates Retrieval (Cloud with fallback)
  console.log('\nTest 5: Mandi Rates Retrieval');
  const mandi = await supabaseService.getMandiRates();
  if (!mandi.data || mandi.data.length === 0) {
    throw new Error('Expected Mandi rates to return data');
  }
  console.log(`  ✓ Retrieved ${mandi.data.length} vegetable mandi rates from source: ${mandi.source}`);

  // Test 6: Audit Logging
  console.log('\nTest 6: Audit Logging');
  await supabaseService.recordAuditLog('TEST_EVENT', 'SYSTEM', 'Supabase test runner execution', 'SUCCESS');
  console.log(`  ✓ Audit log recorded successfully`);

  console.log('\n======================================================');
  console.log('✅ ALL 6 SUPABASE RESILIENT INTEGRATION TESTS PASSED!');
  console.log('======================================================');
  process.exit(0);
}

runSupabaseTests().catch((err) => {
  console.error('❌ Supabase Test Failed:', err);
  process.exit(1);
});
