import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Setting up database...');

  // Check if admin user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
  });

  if (existingUser) {
    console.log('Admin user already exists.');
  } else {
    // Create admin user
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || 'admin123',
      10
    );

    const admin = await prisma.user.create({
      data: {
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: hashedPassword,
        name: 'Admin',
      },
    });

    console.log('Admin user created:', admin.email);
  }

  console.log('Setup complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
