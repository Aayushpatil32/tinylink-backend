// Simple test script for TinyLink API
// Run with: node test.js

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function runTests() {
  console.log('🚀 Starting TinyLink API Tests...\n');
  console.log(`Testing against: ${BASE_URL}\n`);

  let testCode = '';

  try {
    // Test 1: Health Check
    console.log('Test 1: Health Check');
    const healthRes = await fetch(`${BASE_URL}/healthz`);
    const healthData = await healthRes.json();
    console.log(`✅ Status: ${healthRes.status}`);
    console.log(`Response:`, healthData);
    console.log('---\n');

    // Test 2: Create a link with custom code
    console.log('Test 2: Create Link with Custom Code');
    testCode = 'test' + Math.random().toString(36).substring(7);
    const createRes = await fetch(`${BASE_URL}/api/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target_url: 'https://www.google.com',
        code: testCode
      })
    });
    const createData = await createRes.json();
    console.log(`✅ Status: ${createRes.status}`);
    console.log(`Response:`, createData);
    console.log('---\n');

    // Test 3: Try creating duplicate code (should fail with 409)
    console.log('Test 3: Create Duplicate Code (should return 409)');
    const dupRes = await fetch(`${BASE_URL}/api/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target_url: 'https://www.example.com',
        code: testCode
      })
    });
    const dupData = await dupRes.json();
    console.log(`✅ Status: ${dupRes.status} (expected 409)`);
    console.log(`Response:`, dupData);
    console.log('---\n');

    // Test 4: Get all links
    console.log('Test 4: Get All Links');
    const listRes = await fetch(`${BASE_URL}/api/links`);
    const listData = await listRes.json();
    console.log(`✅ Status: ${listRes.status}`);
    console.log(`Total links: ${listData.length}`);
    console.log(`First link:`, listData[0]);
    console.log('---\n');

    // Test 5: Get specific link stats
    console.log('Test 5: Get Link Stats');
    const statsRes = await fetch(`${BASE_URL}/api/links/${testCode}`);
    const statsData = await statsRes.json();
    console.log(`✅ Status: ${statsRes.status}`);
    console.log(`Response:`, statsData);
    console.log('---\n');

    // Test 6: Test redirect (won't follow, just check status)
    console.log('Test 6: Test Redirect');
    const redirectRes = await fetch(`${BASE_URL}/${testCode}`, {
      redirect: 'manual'
    });
    console.log(`✅ Status: ${redirectRes.status} (expected 302)`);
    console.log(`Location: ${redirectRes.headers.get('location')}`);
    console.log('---\n');

    // Test 7: Verify click count increased
    console.log('Test 7: Verify Click Count Increased');
    const statsRes2 = await fetch(`${BASE_URL}/api/links/${testCode}`);
    const statsData2 = await statsRes2.json();
    console.log(`✅ Status: ${statsRes2.status}`);
    console.log(`Click count: ${statsData2.total_clicks} (should be 1)`);
    console.log('---\n');

    // Test 8: Delete link
    console.log('Test 8: Delete Link');
    const deleteRes = await fetch(`${BASE_URL}/api/links/${testCode}`, {
      method: 'DELETE'
    });
    const deleteData = await deleteRes.json();
    console.log(`✅ Status: ${deleteRes.status}`);
    console.log(`Response:`, deleteData);
    console.log('---\n');

    // Test 9: Verify link is deleted (should return 404)
    console.log('Test 9: Verify Link Deleted (should return 404)');
    const notFoundRes = await fetch(`${BASE_URL}/${testCode}`, {
      redirect: 'manual'
    });
    console.log(`✅ Status: ${notFoundRes.status} (expected 404)`);
    console.log('---\n');

    console.log('🎉 All tests completed!\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

runTests();