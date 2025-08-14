const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Creating demo user...');

  const demoEmail = 'demo@example.com';
  const demoPassword = 'demo123';
  const demoName = 'Demo User';

  try {
    // Check if demo user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: demoEmail },
    });

    if (existingUser) {
      console.log('Demo user already exists, updating password...');

      // Update password
      const hashedPassword = await bcrypt.hash(demoPassword, 12);
      await prisma.user.update({
        where: { email: demoEmail },
        data: { password: hashedPassword },
      });

      console.log('Demo user password updated!');
    } else {
      // Create new demo user
      const hashedPassword = await bcrypt.hash(demoPassword, 12);

      const user = await prisma.user.create({
        data: {
          name: demoName,
          email: demoEmail,
          password: hashedPassword,
        },
      });

      console.log('Demo user created successfully!');
      console.log('Email:', demoEmail);
      console.log('Password:', demoPassword);
      console.log('User ID:', user.id);
    }

    // Update existing mood entries to use the demo user
    const demoUser = await prisma.user.findUnique({
      where: { email: demoEmail },
    });

    if (demoUser) {
      await prisma.moodEntry.updateMany({
        where: { userId: 'demo-user' },
        data: { userId: demoUser.id },
      });

      console.log('Updated mood entries to use real demo user ID');
    }
  } catch (error) {
    console.error('Error creating demo user:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
