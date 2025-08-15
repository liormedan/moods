import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'משתמש דמו',
      image: null
    }
  })

  console.log('✅ Demo user created:', demoUser.email)

  // Create sample mood entries for the last 14 days
  const moodEntries = []
  const today = new Date()

  for (let i = 0; i < 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    date.setHours(12, 0, 0, 0) // Set to noon to avoid timezone issues

    const moodValue = Math.floor(Math.random() * 4) + 6 // Random mood between 6-9
    const notes = [
      'יום טוב!',
      'מרגיש בסדר',
      'יום מעולה בעבודה',
      'קצת עייף אבל בסדר',
      'יום נהדר עם המשפחה',
      'מרגיש מאוד טוב',
      'יום רגוע ונעים',
      null
    ]

    moodEntries.push({
      userId: demoUser.id,
      moodValue,
      notes: notes[Math.floor(Math.random() * notes.length)],
      date
    })
  }

  // Insert mood entries
  for (const entry of moodEntries) {
    await prisma.moodEntry.upsert({
      where: {
        userId_date: {
          userId: entry.userId,
          date: entry.date
        }
      },
      update: {
        moodValue: entry.moodValue,
        notes: entry.notes
      },
      create: entry
    })
  }

  console.log(`✅ Created ${moodEntries.length} mood entries`)

  // Create sample insights
  const insights = [
    {
      userId: demoUser.id,
      type: 'celebration',
      title: 'מגמה חיובית!',
      description: 'מצב הרוח שלך השתפר ב-15% השבוע האחרון. המשך כך! 🎉',
      priority: 'medium',
      actionable: false
    },
    {
      userId: demoUser.id,
      type: 'recommendation',
      title: 'המלצה לפעילות',
      description: 'נראה שפעילות גופנית משפיעה חיובית על מצב הרוח שלך. נסה להוסיף 15 דקות הליכה ביום.',
      priority: 'high',
      actionable: true
    },
    {
      userId: demoUser.id,
      type: 'milestone',
      title: 'רצף מעולה!',
      description: 'כל הכבוד! 7 ימים רצופים של מעקב אחר מצב הרוח 🔥',
      priority: 'low',
      actionable: false
    }
  ]

  for (const insight of insights) {
    await prisma.insight.create({
      data: insight
    })
  }

  console.log(`✅ Created ${insights.length} insights`)

  // Create sample goals
  const goals = [
    {
      userId: demoUser.id,
      title: 'מדיטציה יומית',
      description: 'להתחיל לתרגל מדיטציה 10 דקות בכל יום',
      category: 'mental-health',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      progress: 40,
      status: 'in-progress',
      priority: 'high',
      milestones: JSON.stringify([
        { id: 1, title: 'שבוע ראשון', completed: true },
        { id: 2, title: 'שבועיים', completed: true },
        { id: 3, title: 'שלושה שבועות', completed: false },
        { id: 4, title: 'חודש שלם', completed: false }
      ])
    },
    {
      userId: demoUser.id,
      title: 'פעילות גופנית',
      description: 'להגיע ל-3 אימונים בשבוע',
      category: 'physical',
      targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      progress: 65,
      status: 'in-progress',
      priority: 'medium',
      milestones: JSON.stringify([
        { id: 1, title: 'אימון ראשון', completed: true },
        { id: 2, title: 'שבוע של אימונים', completed: true },
        { id: 3, title: 'חודש של עקביות', completed: false }
      ])
    }
  ]

  for (const goal of goals) {
    await prisma.goal.create({
      data: goal
    })
  }

  console.log(`✅ Created ${goals.length} goals`)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })