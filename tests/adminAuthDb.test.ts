import { platformDb } from '../src/server/db';
import fs from 'node:fs';

console.log('=== KISHANSETU ADMIN DATABASE & AUTHENTICATION INTEGRATION TEST ===\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ ${testName}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAILED: ${testName}`);
    process.exitCode = 1;
  }
}

// Test 1: Database Initialization and Persistence
console.log('Test 1: Database Initialization and File Persistence');
const dbStats = platformDb.getDatabaseStats();
assert(dbStats.status === 'ONLINE', 'Database status is ONLINE');
assert(fs.existsSync(dbStats.dbPath), `Database file exists on disk: ${dbStats.dbPath}`);
assert(dbStats.totalUsers >= 4, `Database contains seed users (${dbStats.totalUsers} users)`);
assert(dbStats.adminConfigured === true, 'Admin account is configured in database');
assert(dbStats.adminUsername === 'admin', 'Default admin username is "admin"');

// Test 2: Admin Authentication with Valid Credentials
console.log('\nTest 2: Admin Authentication with Valid Credentials');
const validAuth = platformDb.verifyAdminCredentials('admin', 'Admin@KishanSetu2026');
assert(validAuth.success === true, 'Successfully authenticated using username "admin"');
assert(validAuth.user?.role === 'admin', 'Authenticated user role is "admin"');

const validEmailAuth = platformDb.verifyAdminCredentials('admin@kishansetu.in', 'Admin@KishanSetu2026');
assert(validEmailAuth.success === true, 'Successfully authenticated using email "admin@kishansetu.in"');

// Test 3: Rejection of Invalid Password
console.log('\nTest 3: Rejection of Invalid Password');
const invalidPasswordAuth = platformDb.verifyAdminCredentials('admin', 'WrongPassword123');
assert(invalidPasswordAuth.success === false, 'Rejected incorrect password');
assert(invalidPasswordAuth.error !== undefined, 'Returned descriptive rejection error');

// Test 4: Rejection of Non-Existent User
console.log('\nTest 4: Rejection of Non-Existent User');
const unknownUserAuth = platformDb.verifyAdminCredentials('nonexistent_user', 'any_pass');
assert(unknownUserAuth.success === false, 'Rejected non-existent user');

// Test 5: Rejection of Non-Admin User Attempting Admin Clearance
console.log('\nTest 5: Rejection of Non-Admin User Attempting Admin Clearance');
const nonAdminAuth = platformDb.verifyAdminCredentials('ramesh.farmer', 'FarmerHarvest#2025');
assert(nonAdminAuth.success === false, 'Rejected non-admin user (farmer) attempting admin clearance');

// Test 6: Session Creation and Verification
console.log('\nTest 6: Session Creation and Verification');
if (validAuth.user) {
  const session = platformDb.createSession(validAuth.user.id, validAuth.user.role);
  assert(session.token.startsWith('ks_adm_sess_'), 'Session token format is valid');
  const sessionCheck = platformDb.verifySession(session.token);
  assert(sessionCheck.valid === true, 'Session token verified successfully');
  assert(sessionCheck.user?.username === 'admin', 'Session belongs to admin');
}

// Test 7: Updating Admin Credentials
console.log('\nTest 7: Updating Admin Credentials & Persistent Sync');
const updateResult = platformDb.updateAdminCredentials('admin', 'admin', 'KishanAdmin#Updated2026');
assert(updateResult.success === true, 'Successfully updated admin password in database');

// Verify new password works
const newPassAuth = platformDb.verifyAdminCredentials('admin', 'KishanAdmin#Updated2026');
assert(newPassAuth.success === true, 'Successfully authenticated with NEW password');

// Verify old password no longer works
const oldPassAuth = platformDb.verifyAdminCredentials('admin', 'Admin@KishanSetu2026');
assert(oldPassAuth.success === false, 'Old password was invalidated');

// Revert to canonical default Admin@KishanSetu2026 for seamless evaluation
platformDb.updateAdminCredentials('admin', 'admin', 'Admin@KishanSetu2026');
const resetAuth = platformDb.verifyAdminCredentials('admin', 'Admin@KishanSetu2026');
assert(resetAuth.success === true, 'Restored canonical default password for user convenience');

console.log(`\n======================================================`);
console.log(`SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log(`======================================================\n`);
