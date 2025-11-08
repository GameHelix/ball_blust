import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testLogin() {
  console.log('🔐 Testing Login Functionality...\n');

  try {
    // Fetch the admin user
    const user = await prisma.user.findUnique({
      where: { email: 'admin@example.com' },
    });

    if (!user) {
      console.log('❌ Admin user not found!');
      return;
    }

    console.log('✅ Admin user found:');
    console.log(`   Email: ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.name || 'N/A'}`);

    // Test password verification
    console.log('\n🔑 Testing password verification...');
    const testPassword = 'change-this-password';

    const isValid = await bcrypt.compare(testPassword, user.password);

    if (isValid) {
      console.log(`   ✅ Password "${testPassword}" is VALID`);
    } else {
      console.log(`   ❌ Password "${testPassword}" is INVALID`);
      console.log('   This might be the issue - password in database doesn\'t match!');
    }

    // Show hashed password format
    console.log('\n📊 Password Info:');
    console.log(`   Hash starts with: ${user.password.substring(0, 7)}`);
    console.log(`   Hash length: ${user.password.length}`);
    console.log(`   Expected format: $2a$ or $2b$ (bcrypt)`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
