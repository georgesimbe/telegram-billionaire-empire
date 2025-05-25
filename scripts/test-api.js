#!/usr/bin/env node

const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

// Test user data (matches the test user in init-mongo.js)
const testHeaders = {
  'Content-Type': 'application/json',
  'x-telegram-init-data': 'test_data_for_development'
};

async function runTests() {
  console.log('🧪 Testing Billionaire Empire API...\n');

  const tests = [
    {
      name: 'Health Check',
      method: 'GET',
      url: `${API_BASE}/../health`,
      headers: {}
    },
    {
      name: 'Get User Profile',
      method: 'GET',
      url: `${API_BASE}/game/profile`,
      headers: testHeaders
    },
    {
      name: 'Tap Action',
      method: 'POST',
      url: `${API_BASE}/game/tap`,
      headers: testHeaders,
      data: { taps: 5 }
    },
    {
      name: 'Get Leaderboard',
      method: 'GET',
      url: `${API_BASE}/game/leaderboard`,
      headers: testHeaders
    },
    {
      name: 'Collect Business Earnings',
      method: 'POST',
      url: `${API_BASE}/game/business/collect`,
      headers: testHeaders
    },
    {
      name: 'Get Withdrawal Info',
      method: 'GET',
      url: `${API_BASE}/wallet/withdrawal-info`,
      headers: testHeaders
    },
    {
      name: 'Get Referral Info',
      method: 'GET',
      url: `${API_BASE}/social/referral`,
      headers: testHeaders
    },
    {
      name: 'Get Social Stats',
      method: 'GET',
      url: `${API_BASE}/social/stats`,
      headers: testHeaders
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const config = {
        method: test.method,
        url: test.url,
        headers: test.headers,
        timeout: 5000
      };

      if (test.data) {
        config.data = test.data;
      }

      const response = await axios(config);

      if (response.status >= 200 && response.status < 300) {
        console.log(`✅ ${test.name} - ${response.status}`);
        passed++;
      } else {
        console.log(`❌ ${test.name} - ${response.status}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} - ${error.response?.status || 'ERROR'}: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('🎉 All tests passed! Your API is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check your server configuration.');
    process.exit(1);
  }
}

// Run tests if called directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  });
}

module.exports = { runTests }; 