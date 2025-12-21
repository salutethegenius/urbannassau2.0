import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default fare settings
  const fareSettings = await prisma.fareSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      rideStandardBase: 15,
      ridePremiumBase: 20,
      freeDistance: 5,
      perMileRate: 4,
      passengerFee: 5,
      courierBase: 12,
      errandBase: 25,
      shoppingBase: 50,
      transportBase: 20,
    },
  });

  console.log('✅ Created fare settings:', fareSettings);

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@urbannassau.com' },
    update: {},
    create: {
      email: 'admin@urbannassau.com',
      password: hashedPassword,
      name: 'Admin',
    },
  });

  console.log('✅ Created admin user:', adminUser.email);
  console.log('');
  console.log('🔐 Default Admin Credentials:');
  console.log('   Email: admin@urbannassau.com');
  console.log('   Password: admin123');
  console.log('');
  console.log('⚠️  Please change the password after first login!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
