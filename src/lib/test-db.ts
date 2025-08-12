import { prisma } from './db';

// Simple function to test database connection
export async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`📊 Current user count: ${userCount}`);

    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testDatabaseConnection();
}
