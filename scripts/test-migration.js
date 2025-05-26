#!/usr/bin/env node

/**
 * Test Script: Verify Store Migration Success
 * 
 * This script tests the integrated store functionality to ensure
 * the migration from gameStore to integratedGameStore was successful.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const TEST_RESULTS = {
  passed: 0,
  failed: 0,
  errors: []
};

function logTest(testName, passed, error = null) {
  if (passed) {
    console.log(`✅ ${testName}`);
    TEST_RESULTS.passed++;
  } else {
    console.log(`❌ ${testName}`);
    TEST_RESULTS.failed++;
    if (error) {
      TEST_RESULTS.errors.push({ test: testName, error: error.message });
    }
  }
}

function testFileExists(filePath, description) {
  try {
    const exists = fs.existsSync(filePath);
    logTest(`${description} exists`, exists);
    return exists;
  } catch (error) {
    logTest(`${description} exists`, false, error);
    return false;
  }
}

function testFileContains(filePath, searchString, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const contains = content.includes(searchString);
    logTest(`${description}`, contains);
    return contains;
  } catch (error) {
    logTest(`${description}`, false, error);
    return false;
  }
}

function testImportMigration(filePath, fileName) {
  const content = fs.readFileSync(filePath, 'utf8');
  const hasOldImport = content.includes('useGameStore');
  const hasNewImport = content.includes('useIntegratedGameStore');

  // If file uses store, it should have new import and not old import
  if (hasNewImport) {
    logTest(`${fileName} - Successfully migrated to integratedGameStore`, !hasOldImport);
    return !hasOldImport;
  } else if (!hasOldImport && !hasNewImport) {
    logTest(`${fileName} - No store usage (OK)`, true);
    return true;
  } else {
    logTest(`${fileName} - Still uses old gameStore`, false);
    return false;
  }
}

function main() {
  console.log('🧪 Testing Store Migration Success...\n');

  // Test 1: Core Files Exist
  console.log('📁 Testing Core Files...');
  testFileExists('src/store/integratedGameStore.js', 'Integrated Game Store');
  testFileExists('src/store/modules/index.js', 'Store Modules Index');
  testFileExists('src/App.jsx', 'Main App Component');

  // Test 2: App.jsx Migration
  console.log('\n📱 Testing App.jsx Migration...');
  testFileContains('src/App.jsx', 'useIntegratedGameStore', 'App.jsx uses integratedGameStore');
  testFileContains('src/App.jsx', 'initializeGame', 'App.jsx uses initializeGame method');
  const appContent = fs.readFileSync('src/App.jsx', 'utf8');
  const appHasOldStore = appContent.includes('useGameStore');
  logTest('App.jsx fully migrated (no old imports)', !appHasOldStore);

  // Test 3: Key Components Migration
  console.log('\n🧩 Testing Component Migrations...');
  const keyComponents = [
    'src/components/AntiCheatWrapper.jsx',
    'src/components/BusinessCard.jsx',
    'src/components/EconomicDashboard.jsx'
  ];

  keyComponents.forEach(componentPath => {
    const fileName = path.basename(componentPath);
    if (fs.existsSync(componentPath)) {
      testImportMigration(componentPath, fileName);
    }
  });

  // Test 4: Key Pages Migration
  console.log('\n📄 Testing Page Migrations...');
  const keyPages = [
    'src/pages/HomePage.jsx',
    'src/pages/BusinessPage.jsx',
    'src/pages/StakingPage.jsx'
  ];

  keyPages.forEach(pagePath => {
    const fileName = path.basename(pagePath);
    if (fs.existsSync(pagePath)) {
      testImportMigration(pagePath, fileName);
    }
  });

  // Test 5: Store Module Structure
  console.log('\n🏗️  Testing Store Module Structure...');
  const storeModules = [
    'src/store/modules/playerStore.js',
    'src/store/modules/businessStore.js',
    'src/store/modules/bankingStore.js',
    'src/store/modules/stakingStore.js'
  ];

  storeModules.forEach(modulePath => {
    const fileName = path.basename(modulePath);
    testFileExists(modulePath, `Store Module: ${fileName}`);
  });

  // Test 6: Build Test
  console.log('\n🔨 Testing Build Process...');
  try {
    console.log('Running build test...');
    execSync('npm run build', { stdio: 'pipe', timeout: 60000 });
    logTest('Build process succeeds', true);
  } catch (error) {
    logTest('Build process succeeds', false, error);
  }

  // Test 7: Development Server
  console.log('\n🚀 Testing Development Server...');
  try {
    const response = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:5173', {
      stdio: 'pipe',
      timeout: 5000
    }).toString().trim();

    const serverRunning = response === '200';
    logTest('Development server responds', serverRunning);
  } catch (error) {
    logTest('Development server responds', false, error);
  }

  // Results Summary
  console.log('\n' + '='.repeat(50));
  console.log('🎯 Test Results Summary');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${TEST_RESULTS.passed}`);
  console.log(`❌ Failed: ${TEST_RESULTS.failed}`);
  console.log(`📊 Success Rate: ${Math.round((TEST_RESULTS.passed / (TEST_RESULTS.passed + TEST_RESULTS.failed)) * 100)}%`);

  if (TEST_RESULTS.errors.length > 0) {
    console.log('\n🐛 Errors Found:');
    TEST_RESULTS.errors.forEach(({ test, error }) => {
      console.log(`   • ${test}: ${error}`);
    });
  }

  // Recommendations
  console.log('\n📋 Next Actions:');
  if (TEST_RESULTS.failed === 0) {
    console.log('🎉 All tests passed! Migration appears successful.');
    console.log('👉 Recommended: Manual testing in browser');
    console.log('👉 Test core game mechanics (earning, spending, businesses)');
    console.log('👉 Test state persistence (refresh browser)');
  } else {
    console.log('⚠️  Some tests failed. Review errors above.');
    console.log('👉 Fix critical issues before proceeding');
    console.log('👉 Re-run tests after fixes');
  }

  console.log('\n🌐 Manual Testing:');
  console.log('   Open: http://localhost:5173');
  console.log('   Test: Navigation, game initialization, core mechanics');

  return TEST_RESULTS.failed === 0;
}

// Run tests
const success = main();
process.exit(success ? 0 : 1); 