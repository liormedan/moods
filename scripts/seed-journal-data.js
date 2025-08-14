const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Adding demo journal data...');

  // Demo user ID
  const userId = 'demo-user';

  // Create demo journal entries
  const journalEntries = [
    {
      userId,
      title: 'יום מעולה בעבודה',
      content: `היום הצלחתי לסיים פרויקט חשוב שעבדתי עליו כבר כמה שבועות. הרגשתי מאוד מרוצה מהתוצאה והקבלתי משוב חיובי מהמנהל שלי.

**מה למדתי על עצמי היום?**
למדתי שאני יכול להתמודד עם לחץ ולהשיג תוצאות טובות גם כשהזמן קצר.

**איך התמודדתי עם אתגרים?**
חילקתי את המשימות לחלקים קטנים יותר ועבדתי בצורה מתודית.

**מה הייתי עושה אחרת?**
הייתי מתחיל לעבוד על הפרויקט קצת יותר מוקדם כדי להפחית את הלחץ.`,
      mood: 8,
      tags: JSON.stringify(['עבודה', 'הצלחה', 'גאווה', 'פרויקט']),
      template: 'reflection',
      isFavorite: true,
    },
    {
      userId,
      title: 'רגעי הכרת תודה',
      content: `**על מה אני מודה היום?**
אני מודה על המשפחה שלי שתמיד תומכת בי, על הבריאות שלי ושל יקיריי, ועל ההזדמנויות שיש לי ללמוד ולהתפתח.

**מה היה הרגע הטוב ביותר היום?**
השיחה עם אמא שלי בערב. היא סיפרה לי על הילדות שלה וזה היה מאוד מרגש.

**איך הרגשתי כשקרה משהו טוב?**
הרגשתי חם בלב ומחובר למשפחה שלי. זה נתן לי כוח והשראה.`,
      mood: 7,
      tags: JSON.stringify(['הכרת תודה', 'משפחה', 'אהבה']),
      template: 'gratitude',
      isFavorite: false,
    },
    {
      userId,
      title: 'יום מאתגר',
      content: `היום היה קשה. הרגשתי עייף ומתוסכל מכמה דברים שלא הלכו כמו שתכננתי.

**איך הרגשתי היום ולמה?**
הרגשתי מתוח וקצת עצוב. היו לי ציפיות גבוהות מהיום והמציאות הייתה שונה.

**מה גרם לי להרגיש כך?**
פגישה שבוטלה ברגע האחרון ובעיות טכניות במחשב שגרמו לי לאבד זמן יקר.

**איך אני יכול להתמודד טוב יותר עם הרגש הזה?**
לנסות להיות יותר גמיש ולא להיקשר יותר מדי לתוכניות. לזכור שימים קשים הם חלק מהחיים.`,
      mood: 4,
      tags: JSON.stringify(['אתגר', 'רגשות', 'למידה']),
      template: 'emotions',
      isFavorite: false,
    },
    {
      userId,
      title: 'התקדמות במטרות',
      content: `**איך התקדמתי לקראת המטרות שלי?**
השבוע התחלתי לרוץ 3 פעמים והצלחתי לקרוא 50 עמודים מהספר שרציתי לסיים.

**מה ההישג הקטן שלי היום?**
הצלחתי לקום מוקדם יותר ולהתחיל את היום בצורה פרודוקטיבית.

**מה המטרה שלי למחר?**
להמשיך עם הרוטינה הבוקר ולסיים עוד פרק בספר.`,
      mood: 6,
      tags: JSON.stringify(['מטרות', 'ספורט', 'קריאה', 'רוטינה']),
      template: 'goals',
      isFavorite: true,
    },
    {
      userId,
      title: 'מחשבות על החיים',
      content: `היום חשבתי הרבה על הכיוון שאני רוצה לקחת בחיים. יש לי הרבה חלומות ורעיונות, אבל לפעמים קשה לי להחליט איך להתחיל.

אני מרגיש שאני במקום טוב בחיים, אבל יש עוד הרבה דברים שאני רוצה להשיג. החשוב הוא לא לוותר ולהמשיך לנסות.

זה יומן שעוזר לי לארגן את המחשבות ולהבין טוב יותר את עצמי.`,
      mood: 6,
      tags: JSON.stringify(['מחשבות', 'חלומות', 'עתיד']),
      template: null,
      isFavorite: false,
    },
  ];

  for (const entry of journalEntries) {
    try {
      await prisma.journalEntry.create({
        data: entry,
      });
      console.log(`Added journal entry: ${entry.title}`);
    } catch (error) {
      console.error(`Error adding entry "${entry.title}":`, error.message);
    }
  }

  console.log('Demo journal data added successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
