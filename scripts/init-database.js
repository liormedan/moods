const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Initializing database...');

  try {
    // Create demo user
    const demoEmail = 'demo@example.com';
    const demoPassword = 'demo123';
    const demoName = 'משתמש דמו';

    console.log('👤 Creating demo user...');
    
    // Check if demo user exists
    let demoUser = await prisma.user.findUnique({
      where: { email: demoEmail }
    });

    if (!demoUser) {
      const hashedPassword = await bcrypt.hash(demoPassword, 12);
      
      demoUser = await prisma.user.create({
        data: {
          name: demoName,
          email: demoEmail,
          password: hashedPassword,
        }
      });
      
      console.log('✅ Demo user created!');
    } else {
      console.log('✅ Demo user already exists!');
    }

    console.log('📧 Email: demo@example.com');
    console.log('🔑 Password: demo123');

    // Create sample mood entries
    console.log('📊 Creating sample mood data...');
    
    const moodEntries = [];
    const today = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const moodValue = Math.floor(Math.random() * 10) + 1;
      const notes = [
        'יום טוב בסך הכל',
        'הרגשתי קצת עצוב',
        'יום מעולה!',
        'קצת מתוח מהעבודה',
        'שמח ומרוצה',
        'יום רגיל',
        'הרגשתי מאוד טוב',
        'קצת עייף',
        'מצב רוח מצוין',
        'יום מאתגר'
      ][Math.floor(Math.random() * 10)];

      try {
        await prisma.moodEntry.upsert({
          where: {
            userId_date: {
              userId: demoUser.id,
              date: date
            }
          },
          update: {
            moodValue,
            notes
          },
          create: {
            userId: demoUser.id,
            moodValue,
            notes,
            date
          }
        });
      } catch (error) {
        // Skip if entry already exists
      }
    }

    console.log('✅ Sample mood data created!');

    // Create sample journal entries
    console.log('📝 Creating sample journal entries...');
    
    const journalEntries = [
      {
        title: 'רפלקציה על השבוע',
        content: 'השבוע היה מלא באתגרים אבל גם בהישגים. למדתי הרבה על עצמי.',
        mood: 7,
        tags: '["רפלקציה", "למידה", "צמיחה"]',
        template: 'reflection'
      },
      {
        title: 'דברים שאני אסיר תודה עליהם',
        content: 'אני אסיר תודה על המשפחה שלי, על הבריאות, ועל ההזדמנויות שיש לי.',
        mood: 8,
        tags: '["הכרת תודה", "משפחה", "בריאות"]',
        template: 'gratitude'
      },
      {
        title: 'המטרות שלי לחודש הבא',
        content: 'אני רוצה להתחיל לעשות יותר ספורט ולקרוא ספר חדש.',
        mood: 6,
        tags: '["מטרות", "ספורט", "קריאה"]',
        template: 'goals'
      }
    ];

    for (const entry of journalEntries) {
      try {
        await prisma.journalEntry.create({
          data: {
            ...entry,
            userId: demoUser.id
          }
        });
      } catch (error) {
        // Skip if error
      }
    }

    console.log('✅ Sample journal entries created!');

    // Create sample goals
    console.log('🎯 Creating sample goals...');
    
    const goals = [
      {
        title: 'שיפור כושר גופני',
        description: 'להתחיל להתאמן 3 פעמים בשבוע',
        category: 'physical',
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        progress: 40,
        status: 'in-progress',
        priority: 'high',
        milestones: JSON.stringify([
          { id: 1, text: 'רישום לחדר כושר', completed: true },
          { id: 2, text: 'אימון ראשון', completed: true },
          { id: 3, text: 'שבוע של אימונים', completed: false }
        ])
      },
      {
        title: 'מדיטציה יומית',
        description: 'לעשות מדיטציה 10 דקות כל יום',
        category: 'mental-health',
        targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        progress: 70,
        status: 'in-progress',
        priority: 'medium',
        milestones: JSON.stringify([
          { id: 1, text: 'הורדת אפליקציה', completed: true },
          { id: 2, text: 'שבוע ראשון', completed: true },
          { id: 3, text: 'חודש שלם', completed: false }
        ])
      }
    ];

    for (const goal of goals) {
      try {
        await prisma.goal.create({
          data: {
            ...goal,
            userId: demoUser.id
          }
        });
      } catch (error) {
        // Skip if error
      }
    }

    console.log('✅ Sample goals created!');

    console.log('🎉 Database initialization completed!');
    console.log('');
    console.log('🔑 Login credentials:');
    console.log('   Email: demo@example.com');
    console.log('   Password: demo123');
    console.log('');
    console.log('🌐 Visit: http://localhost:3000/auth/signin');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
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