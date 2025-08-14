const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Adding demo breathing session data...');

  // Demo user ID
  const userId = 'demo-user';

  // Create demo breathing sessions
  const breathingSessions = [
    {
      userId,
      exerciseId: 'box-breathing',
      exerciseName: 'נשימת קופסה',
      duration: 80, // 4+4+4 * 5 cycles = 60 seconds + some buffer
      cycles: 5,
      inhaleTime: 4,
      holdTime: 4,
      exhaleTime: 4,
      completed: true,
      createdAt: new Date('2025-08-14T08:30:00Z'),
    },
    {
      userId,
      exerciseId: '4-7-8-breathing',
      exerciseName: 'נשימה 4-7-8',
      duration: 76, // (4+7+8) * 4 cycles = 76 seconds
      cycles: 4,
      inhaleTime: 4,
      holdTime: 7,
      exhaleTime: 8,
      completed: true,
      createdAt: new Date('2025-08-13T19:15:00Z'),
    },
    {
      userId,
      exerciseId: 'deep-belly-breathing',
      exerciseName: 'נשימה עמוקה מהבטן',
      duration: 96, // (5+2+5) * 8 cycles = 96 seconds
      cycles: 8,
      inhaleTime: 5,
      holdTime: 2,
      exhaleTime: 5,
      completed: true,
      createdAt: new Date('2025-08-13T07:45:00Z'),
    },
    {
      userId,
      exerciseId: 'box-breathing',
      exerciseName: 'נשימת קופסה',
      duration: 80,
      cycles: 5,
      inhaleTime: 4,
      holdTime: 4,
      exhaleTime: 4,
      completed: true,
      createdAt: new Date('2025-08-12T20:30:00Z'),
    },
    {
      userId,
      exerciseId: 'coherent-breathing',
      exerciseName: 'נשימה קוהרנטית',
      duration: 120, // (6+0+6) * 10 cycles = 120 seconds
      cycles: 10,
      inhaleTime: 6,
      holdTime: 0,
      exhaleTime: 6,
      completed: true,
      createdAt: new Date('2025-08-11T18:00:00Z'),
    },
    {
      userId,
      exerciseId: 'custom',
      exerciseName: 'תרגיל מותאם אישית',
      duration: 105, // (3+2+4) * 7 cycles = 63 seconds
      cycles: 7,
      inhaleTime: 3,
      holdTime: 2,
      exhaleTime: 4,
      completed: true,
      createdAt: new Date('2025-08-10T16:20:00Z'),
    },
  ];

  for (const session of breathingSessions) {
    try {
      await prisma.breathingSession.create({
        data: session,
      });
      console.log(`Added breathing session: ${session.exerciseName} (${session.duration}s)`);
    } catch (error) {
      console.error(`Error adding session "${session.exerciseName}":`, error.message);
    }
  }

  console.log('Demo breathing session data added successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });