import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  console.log('🔍 Testing Database Connection and Schema...\n');

  try {
    // Test 1: Check admin user
    console.log('1️⃣  Testing User table...');
    const users = await prisma.user.findMany();
    console.log(`   ✅ Found ${users.length} user(s)`);
    if (users.length > 0) {
      console.log(`   📧 Admin email: ${users[0].email}`);
    }

    // Test 2: Check restaurant table
    console.log('\n2️⃣  Testing Restaurant table...');
    const restaurant = await prisma.restaurant.findFirst();
    if (restaurant) {
      console.log(`   ✅ Restaurant found: ${restaurant.name}`);
    } else {
      console.log('   ℹ️  No restaurant configured yet (expected for new setup)');
    }

    // Test 3: Check categories
    console.log('\n3️⃣  Testing Category table...');
    const categories = await prisma.category.findMany();
    console.log(`   ✅ Found ${categories.length} category(ies)`);

    // Test 4: Check menu items
    console.log('\n4️⃣  Testing MenuItem table...');
    const menuItems = await prisma.menuItem.findMany();
    console.log(`   ✅ Found ${menuItems.length} menu item(s)`);

    // Test 5: Test write operation - create a test category
    console.log('\n5️⃣  Testing write operation...');
    const testCategory = await prisma.category.create({
      data: {
        name: 'Test Category',
        description: 'This is a test category to verify write operations',
        order: 999,
      },
    });
    console.log(`   ✅ Created test category: ${testCategory.name}`);

    // Test 6: Test read back
    console.log('\n6️⃣  Testing read operation...');
    const foundCategory = await prisma.category.findUnique({
      where: { id: testCategory.id },
    });
    console.log(`   ✅ Successfully read back: ${foundCategory?.name}`);

    // Test 7: Test update operation
    console.log('\n7️⃣  Testing update operation...');
    const updatedCategory = await prisma.category.update({
      where: { id: testCategory.id },
      data: { description: 'Updated description' },
    });
    console.log(`   ✅ Updated description: ${updatedCategory.description}`);

    // Test 8: Test delete operation
    console.log('\n8️⃣  Testing delete operation...');
    await prisma.category.delete({
      where: { id: testCategory.id },
    });
    console.log('   ✅ Test category deleted successfully');

    // Test 9: Verify schema location
    console.log('\n9️⃣  Verifying schema location...');
    const schemaCheck = await prisma.$queryRaw<any[]>`
      SELECT schemaname, tablename
      FROM pg_tables
      WHERE schemaname = 'menu'
      ORDER BY tablename
    `;
    console.log('   ✅ Tables in "menu" schema:');
    schemaCheck.forEach((table: any) => {
      console.log(`      - ${table.tablename}`);
    });

    console.log('\n✅ All database tests passed!\n');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
