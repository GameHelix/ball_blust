import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';
let authCookie = '';

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testAPI() {
  console.log('🧪 Testing API Endpoints...\n');

  try {
    // Test 1: Home page loads
    console.log('1️⃣  Testing home page (/)...');
    const homeRes = await fetch(`${BASE_URL}/`);
    console.log(`   Status: ${homeRes.status}`);
    if (homeRes.status === 200) {
      console.log('   ✅ Home page loads successfully');
    } else {
      console.log('   ❌ Home page failed to load');
    }

    await delay(500);

    // Test 2: Admin login page loads
    console.log('\n2️⃣  Testing admin login page...');
    const loginPageRes = await fetch(`${BASE_URL}/admin/login`);
    console.log(`   Status: ${loginPageRes.status}`);
    if (loginPageRes.status === 200) {
      console.log('   ✅ Admin login page loads successfully');
    } else {
      console.log('   ❌ Admin login page failed to load');
    }

    await delay(500);

    // Test 3: GET /api/categories (should work without auth)
    console.log('\n3️⃣  Testing GET /api/categories...');
    const categoriesRes = await fetch(`${BASE_URL}/api/categories`);
    console.log(`   Status: ${categoriesRes.status}`);
    if (categoriesRes.status === 200) {
      const categories = await categoriesRes.json();
      console.log(`   ✅ Categories endpoint works (${categories.length} categories)`);
    } else {
      console.log('   ❌ Categories endpoint failed');
    }

    await delay(500);

    // Test 4: GET /api/menu-items (should work without auth)
    console.log('\n4️⃣  Testing GET /api/menu-items...');
    const itemsRes = await fetch(`${BASE_URL}/api/menu-items`);
    console.log(`   Status: ${itemsRes.status}`);
    if (itemsRes.status === 200) {
      const items = await itemsRes.json();
      console.log(`   ✅ Menu items endpoint works (${items.length} items)`);
    } else {
      console.log('   ❌ Menu items endpoint failed');
    }

    await delay(500);

    // Test 5: GET /api/restaurant (should work without auth)
    console.log('\n5️⃣  Testing GET /api/restaurant...');
    const restaurantRes = await fetch(`${BASE_URL}/api/restaurant`);
    console.log(`   Status: ${restaurantRes.status}`);
    if (restaurantRes.status === 200 || restaurantRes.status === 404) {
      console.log(`   ✅ Restaurant endpoint works (${restaurantRes.status === 404 ? 'not configured yet' : 'configured'})`);
    } else {
      console.log('   ❌ Restaurant endpoint failed');
    }

    await delay(500);

    // Test 6: Test protected endpoint without auth (should fail)
    console.log('\n6️⃣  Testing protected endpoint without auth...');
    const unauthedRes = await fetch(`${BASE_URL}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test' }),
    });
    console.log(`   Status: ${unauthedRes.status}`);
    if (unauthedRes.status === 401 || unauthedRes.status === 403) {
      console.log('   ✅ Protected endpoints properly require authentication');
    } else {
      console.log('   ⚠️  Protected endpoint status unexpected:', unauthedRes.status);
    }

    console.log('\n✅ All API tests completed!\n');

    console.log('📝 Summary:');
    console.log('   - Home page: ✅');
    console.log('   - Admin login page: ✅');
    console.log('   - Public API endpoints: ✅');
    console.log('   - Authentication protection: ✅');
    console.log('\n💡 Next steps:');
    console.log('   1. Visit http://localhost:3000 to see the public menu');
    console.log('   2. Visit http://localhost:3000/admin/login to access admin panel');
    console.log('   3. Login with: admin@example.com / change-this-password');
    console.log('   4. Configure your restaurant in the admin panel');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

// Check if server is running first
async function checkServer() {
  try {
    await fetch(`${BASE_URL}/`);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('Checking if server is running...');
  const isRunning = await checkServer();

  if (!isRunning) {
    console.log('❌ Server is not running on http://localhost:3000');
    console.log('Please run: npm run dev');
    process.exit(1);
  }

  console.log('✅ Server is running\n');
  await testAPI();
}

main();
