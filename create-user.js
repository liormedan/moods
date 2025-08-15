const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createUser() {
  try {
    console.log('🔍 Creating user from Supabase data...')
    
    const user = await prisma.user.upsert({
      where: { 
        id: '666f2b96-ce39-4aae-afc3-9c30b4c5212b' // Supabase user ID
      },
      update: {
        email: 'liormedan1@gmail.com',
        name: 'ליאור מדן',
        image: 'https://lh3.googleusercontent.com/a/ACg8ocJktworqVRGI55kON_V0uf2azkoVUXA5ep24QOOYxxAz_odvLVA=s96-c',
        emailVerified: new Date('2025-08-15T14:26:57.898Z')
      },
      create: {
        id: '666f2b96-ce39-4aae-afc3-9c30b4c5212b', // Use Supabase UUID
        email: 'liormedan1@gmail.com',
        name: 'ליאור מדן',
        image: 'https://lh3.googleusercontent.com/a/ACg8ocJktworqVRGI55kON_V0uf2azkoVUXA5ep24QOOYxxAz_odvLVA=s96-c',
        emailVerified: new Date('2025-08-15T14:26:57.898Z')
      }
    })

    console.log('✅ User created/updated:', user.email)
    
    // Create some sample mood entries for the new user
    const moodEntries = []
    const today = new Date()
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      date.setHours(12, 0, 0, 0)
      
      const moodValue = Math.floor(Math.random() * 4) + 6 // Random mood between 6-9
      const notes = [
        'יום טוב!',
        'מרגיש מעולה',
        'יום נהדר בעבודה',
        'מצב רוח חיובי',
        'יום מוצלח',
        null
      ]
      
      await prisma.moodEntry.upsert({
        where: {
          userId_date: {
            userId: user.id,
            date: date
          }
        },
        update: {
          moodValue,
          notes: notes[Math.floor(Math.random() * notes.length)]
        },
        create: {
          userId: user.id,
          moodValue,
          notes: notes[Math.floor(Math.random() * notes.length)],
          date
        }
      })
    }

    console.log('✅ Created 7 mood entries for user')
    
    // Create some insights
    const insights = [
      {
        userId: user.id,
        type: 'celebration',
        title: 'ברוכים השבים!',
        description: 'ברוכים השבים למערכת! התחלת מעולה עם Google OAuth 🎉',
        priority: 'medium',
        actionable: false
      },
      {
        userId: user.id,
        type: 'recommendation',
        title: 'המלצה אישית',
        description: 'מצב הרוח שלך נראה טוב! המשך לעקוב יומית לתובנות מעמיקות יותר.',
        priority: 'high',
        actionable: true
      }
    ]

    for (const insight of insights) {
      await prisma.insight.create({
        data: insight
      })
    }

    console.log('✅ Created insights for user')
    console.log('🎉 Setup completed successfully!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createUser()