const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Adding demo mood data...');

  // Demo user ID
  const userId = 'demo-user';

  // Create demo user first
  try {
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: 'demo@example.com',
        name: 'Demo User',
      },
    });
    console.log('Demo user created/updated');
  } catch (error) {
    console.error('Error creating demo user:', error.message);
  }

  // Create demo mood entries
  const moodEntries = [
    {
      userId,
      moodValue: 7,
      notes: 'יום טוב! פגישה מוצלחת בעבודה והרגשתי מאוד מרוצה.',
      date: new Date('2025-08-12'),
    },
    {
      userId,
      moodValue: 5,
      notes: 'יום רגיל, קצת עייפות אבל בסדר.',
      date: new Date('2025-08-11'),
    },
    {
      userId,
      moodValue: 8,
      notes: 'יום מעולה! בילוי עם חברים והרגשתי מאוד שמח.',
      date: new Date('2025-08-10'),
    },
    {
      userId,
      moodValue: 4,
      notes: 'יום קשה, הרבה לחץ בעבודה.',
      date: new Date('2025-08-09'),
    },
    {
      userId,
      moodValue: 6,
      notes: 'יום בסדר, אימון ספורט עזר לשפר את מצב הרוח.',
      date: new Date('2025-08-08'),
    },
    {
      userId,
      moodValue: 9,
      notes: 'יום פנטסטי! קיבלתי חדשות טובות והכל זרם.',
      date: new Date('2025-08-07'),
    },
    {
      userId,
      moodValue: 3,
      notes: 'יום קשה, הרגשתי עצוב ומתוסכל.',
      date: new Date('2025-08-06'),
    },
    {
      userId,
      moodValue: 7,
      notes: 'יום טוב, פגישה עם חברים ושיחה נחמדה.',
      date: new Date('2025-08-05'),
    },
  ];

  for (const entry of moodEntries) {
    try {
      await prisma.moodEntry.upsert({
        where: {
          userId_date: {
            userId: entry.userId,
            date: entry.date,
          },
        },
        update: entry,
        create: entry,
      });
      console.log(
        `Added mood entry for ${entry.date.toISOString().split('T')[0]}`
      );
    } catch (error) {
      console.error(
        `Error adding entry for ${entry.date.toISOString().split('T')[0]}:`,
        error.message
      );
    }
  }

  console.log('Demo mood data added successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
