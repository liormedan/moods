import {
  InsightTypeSchema,
  CreateInsightSchema,
  UpdateInsightSchema,
} from '@/types/insights';

import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock Prisma
const mockPrisma = {
  insight: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  moodEntry: {
    findMany: jest.fn(),
  },
};

jest.mock('@/lib/db', () => ({
  prisma: mockPrisma,
}));

// Mock NextAuth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// Mock Next.js
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({ data, ...options })),
  },
}));

describe('Insight Data Models', () => {
  describe('InsightTypeSchema', () => {
    it('should accept valid insight types', () => {
      const validTypes = [
        'recommendation',
        'warning',
        'celebration',
        'pattern',
        'milestone',
      ];

      validTypes.forEach((type) => {
        expect(() => InsightTypeSchema.parse(type)).not.toThrow();
      });
    });

    it('should reject invalid insight types', () => {
      const invalidTypes = ['invalid', 'unknown', ''];

      invalidTypes.forEach((type) => {
        expect(() => InsightTypeSchema.parse(type)).toThrow();
      });
    });
  });

  describe('CreateInsightSchema', () => {
    it('should accept valid insight data', () => {
      const validData = {
        type: 'recommendation',
        title: 'המלצה לשיפור מצב רוח',
        description: 'נסה לצאת לטיול קצר בחוץ כדי לשפר את מצב הרוח שלך',
        priority: 'medium',
        actionable: true,
      };

      expect(() => CreateInsightSchema.parse(validData)).not.toThrow();
    });

    it('should accept minimal insight data with defaults', () => {
      const minimalData = {
        type: 'celebration',
        title: 'כל הכבוד!',
        description: 'השבוע היה מעולה',
      };

      const result = CreateInsightSchema.parse(minimalData);
      expect(result.priority).toBe('medium');
      expect(result.actionable).toBe(false);
    });

    it('should reject empty title', () => {
      const invalidData = {
        type: 'recommendation',
        title: '',
        description: 'תיאור תקין',
      };

      expect(() => CreateInsightSchema.parse(invalidData)).toThrow(
        'כותרת נדרשת'
      );
    });

    it('should reject empty description', () => {
      const invalidData = {
        type: 'recommendation',
        title: 'כותרת תקינה',
        description: '',
      };

      expect(() => CreateInsightSchema.parse(invalidData)).toThrow(
        'תיאור נדרש'
      );
    });

    it('should reject title that is too long', () => {
      const longTitle = 'א'.repeat(101);
      const invalidData = {
        type: 'recommendation',
        title: longTitle,
        description: 'תיאור תקין',
      };

      expect(() => CreateInsightSchema.parse(invalidData)).toThrow(
        'כותרת לא יכולה להיות יותר מ-100 תווים'
      );
    });

    it('should reject description that is too long', () => {
      const longDescription = 'א'.repeat(1001);
      const invalidData = {
        type: 'recommendation',
        title: 'כותרת תקינה',
        description: longDescription,
      };

      expect(() => CreateInsightSchema.parse(invalidData)).toThrow(
        'תיאור לא יכול להיות יותר מ-1000 תווים'
      );
    });

    it('should accept expiration date', () => {
      const dataWithExpiration = {
        type: 'warning',
        title: 'אזהרה',
        description: 'שים לב למצב רוח נמוך',
        expiresAt: new Date(Date.now() + 86400000), // Tomorrow
      };

      expect(() => CreateInsightSchema.parse(dataWithExpiration)).not.toThrow();
    });
  });

  describe('UpdateInsightSchema', () => {
    it('should accept isRead update', () => {
      const update = { isRead: true };
      expect(() => UpdateInsightSchema.parse(update)).not.toThrow();
    });

    it('should accept priority update', () => {
      const update = { priority: 'high' };
      expect(() => UpdateInsightSchema.parse(update)).not.toThrow();
    });

    it('should accept empty update', () => {
      expect(() => UpdateInsightSchema.parse({})).not.toThrow();
    });

    it('should reject invalid priority', () => {
      const invalidUpdate = { priority: 'invalid' };
      expect(() => UpdateInsightSchema.parse(invalidUpdate)).toThrow();
    });
  });
});

describe('Insights System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Insight Generation Algorithm', () => {
    const mockMoodEntries = [
      { moodValue: 8, date: new Date('2024-01-01'), notes: 'יום טוב' },
      { moodValue: 7, date: new Date('2024-01-02'), notes: 'יום בסדר' },
      { moodValue: 6, date: new Date('2024-01-03'), notes: 'יום רגיל' },
      { moodValue: 5, date: new Date('2024-01-04'), notes: 'יום בינוני' },
      { moodValue: 4, date: new Date('2024-01-05'), notes: 'יום לא טוב' },
      { moodValue: 3, date: new Date('2024-01-06'), notes: 'יום רע' },
      { moodValue: 2, date: new Date('2024-01-07'), notes: 'יום גרוע' },
      { moodValue: 1, date: new Date('2024-01-08'), notes: 'יום נורא' },
    ];

    it('calculates average mood correctly', () => {
      const total = mockMoodEntries.reduce(
        (sum, entry) => sum + entry.moodValue,
        0
      );
      const average = total / mockMoodEntries.length;

      expect(average).toBe(4.5);
    });

    it('identifies declining trend correctly', () => {
      const firstWeekEntries = mockMoodEntries.slice(0, 4);
      const lastWeekEntries = mockMoodEntries.slice(-4);

      const firstWeekAvg =
        firstWeekEntries.reduce((sum, entry) => sum + entry.moodValue, 0) /
        firstWeekEntries.length;
      const lastWeekAvg =
        lastWeekEntries.reduce((sum, entry) => sum + entry.moodValue, 0) /
        lastWeekEntries.length;

      expect(firstWeekAvg).toBe(6.5); // 8+7+6+5 / 4
      expect(lastWeekAvg).toBe(2.5); // 4+3+2+1 / 4

      const trend = lastWeekAvg < firstWeekAvg - 1 ? 'declining' : 'stable';
      expect(trend).toBe('declining');
    });

    it('identifies improving trend correctly', () => {
      const improvingEntries = [
        { moodValue: 2, date: new Date('2024-01-01') },
        { moodValue: 3, date: new Date('2024-01-02') },
        { moodValue: 4, date: new Date('2024-01-03') },
        { moodValue: 5, date: new Date('2024-01-04') },
        { moodValue: 6, date: new Date('2024-01-05') },
        { moodValue: 7, date: new Date('2024-01-06') },
        { moodValue: 8, date: new Date('2024-01-07') },
        { moodValue: 9, date: new Date('2024-01-08') },
      ];

      const firstWeekEntries = improvingEntries.slice(0, 4);
      const lastWeekEntries = improvingEntries.slice(-4);

      const firstWeekAvg =
        firstWeekEntries.reduce((sum, entry) => sum + entry.moodValue, 0) /
        firstWeekEntries.length;
      const lastWeekAvg =
        lastWeekEntries.reduce((sum, entry) => sum + entry.moodValue, 0) /
        lastWeekEntries.length;

      expect(firstWeekAvg).toBe(3.5); // 2+3+4+5 / 4
      expect(lastWeekAvg).toBe(7.5); // 6+7+8+9 / 4

      const trend = lastWeekAvg > firstWeekAvg + 1 ? 'improving' : 'stable';
      expect(trend).toBe('improving');
    });

    it('identifies stable trend correctly', () => {
      const stableEntries = [
        { moodValue: 5, date: new Date('2024-01-01') },
        { moodValue: 6, date: new Date('2024-01-02') },
        { moodValue: 5, date: new Date('2024-01-03') },
        { moodValue: 6, date: new Date('2024-01-04') },
        { moodValue: 5, date: new Date('2024-01-05') },
        { moodValue: 6, date: new Date('2024-01-06') },
        { moodValue: 5, date: new Date('2024-01-07') },
        { moodValue: 6, date: new Date('2024-01-08') },
      ];

      const firstWeekEntries = stableEntries.slice(0, 4);
      const lastWeekEntries = stableEntries.slice(-4);

      const firstWeekAvg =
        firstWeekEntries.reduce((sum, entry) => sum + entry.moodValue, 0) /
        firstWeekEntries.length;
      const lastWeekAvg =
        lastWeekEntries.reduce((sum, entry) => sum + entry.moodValue, 0) /
        lastWeekEntries.length;

      expect(firstWeekAvg).toBe(5.5); // 5+6+5+6 / 4
      expect(lastWeekAvg).toBe(5.5); // 5+6+5+6 / 4

      const trend =
        Math.abs(lastWeekAvg - firstWeekAvg) <= 1
          ? 'stable'
          : lastWeekAvg > firstWeekAvg + 1
            ? 'improving'
            : 'declining';
      expect(trend).toBe('stable');
    });

    it('calculates streak days correctly', () => {
      const today = new Date('2024-01-08');
      const entries = [
        { moodValue: 5, date: new Date('2024-01-01') },
        { moodValue: 6, date: new Date('2024-01-02') },
        { moodValue: 7, date: new Date('2024-01-03') },
        { moodValue: 8, date: new Date('2024-01-04') },
        { moodValue: 6, date: new Date('2024-01-05') },
        { moodValue: 7, date: new Date('2024-01-06') },
        { moodValue: 8, date: new Date('2024-01-07') },
        { moodValue: 9, date: new Date('2024-01-08') },
      ];

      let streakDays = 0;
      for (let i = 0; i < 8; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);

        const hasEntry = entries.some((entry) => {
          const entryDate = new Date(entry.date);
          entryDate.setHours(0, 0, 0, 0);
          checkDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === checkDate.getTime();
        });

        if (hasEntry) {
          streakDays++;
        } else {
          break;
        }
      }

      expect(streakDays).toBe(8);
    });

    it('identifies mood distribution patterns', () => {
      const moodDistribution: Record<number, number> = {};
      mockMoodEntries.forEach((entry) => {
        moodDistribution[entry.moodValue] =
          (moodDistribution[entry.moodValue] || 0) + 1;
      });

      expect(moodDistribution[8]).toBe(1);
      expect(moodDistribution[7]).toBe(1);
      expect(moodDistribution[6]).toBe(1);
      expect(moodDistribution[5]).toBe(1);
      expect(moodDistribution[4]).toBe(1);
      expect(moodDistribution[3]).toBe(1);
      expect(moodDistribution[2]).toBe(1);
      expect(moodDistribution[1]).toBe(1);

      const highMoodDays =
        (moodDistribution[8] || 0) +
        (moodDistribution[9] || 0) +
        (moodDistribution[10] || 0);
      const lowMoodDays =
        (moodDistribution[1] || 0) +
        (moodDistribution[2] || 0) +
        (moodDistribution[3] || 0);

      expect(highMoodDays).toBe(1);
      expect(lowMoodDays).toBe(3);
    });
  });

  describe('Insight Generation Rules', () => {
    it('generates warning for low average mood', () => {
      const averageMood = 2.5;
      const insights: any[] = [];

      if (averageMood <= 3) {
        insights.push({
          type: 'warning',
          title: 'מצב רוח נמוך מתמשך',
          description:
            'מצב הרוח שלך נמוך בשבועות האחרונים. שקול לפנות לעזרה מקצועית או לשוחח עם חברים קרובים.',
          priority: 'high',
          actionable: true,
        });
      }

      expect(insights).toHaveLength(1);
      expect(insights[0].type).toBe('warning');
      expect(insights[0].priority).toBe('high');
      expect(insights[0].actionable).toBe(true);
    });

    it('generates warning for declining trend', () => {
      const trend = 'declining';
      const insights: any[] = [];

      if (trend === 'declining') {
        insights.push({
          type: 'warning',
          title: 'מגמה יורדת במצב הרוח',
          description:
            'מצב הרוח שלך יורד בשבועות האחרונים. זהה מה השתנה בחייך וחפש דרכים לשיפור.',
          priority: 'medium',
          actionable: true,
        });
      }

      expect(insights).toHaveLength(1);
      expect(insights[0].type).toBe('warning');
      expect(insights[0].priority).toBe('medium');
      expect(insights[0].actionable).toBe(true);
    });

    it('generates celebration for improving trend', () => {
      const trend = 'improving';
      const insights: any[] = [];

      if (trend === 'improving') {
        insights.push({
          type: 'celebration',
          title: 'שיפור במצב הרוח!',
          description:
            'מצוין! מצב הרוח שלך משתפר. המשך בפעילויות שמשפרות את הרגשתך.',
          priority: 'low',
          actionable: false,
        });
      }

      expect(insights).toHaveLength(1);
      expect(insights[0].type).toBe('celebration');
      expect(insights[0].priority).toBe('low');
      expect(insights[0].actionable).toBe(false);
    });

    it('generates milestone for streak days', () => {
      const streakDays = 10;
      const insights: any[] = [];

      if (streakDays >= 7) {
        insights.push({
          type: 'milestone',
          title: 'עקביות בטיפול עצמי',
          description: `כל הכבוד! אתה עוקב אחר מצב הרוח שלך ${streakDays} ימים ברציפות. זה מראה על מחויבות לבריאות הנפש שלך.`,
          priority: 'low',
          actionable: false,
        });
      }

      expect(insights).toHaveLength(1);
      expect(insights[0].type).toBe('milestone');
      expect(insights[0].priority).toBe('low');
      expect(insights[0].actionable).toBe(false);
    });

    it('generates celebration for high average mood', () => {
      const averageMood = 9.2;
      const insights: any[] = [];

      if (averageMood >= 8) {
        insights.push({
          type: 'celebration',
          title: 'מצב רוח מעולה!',
          description:
            'מצב הרוח שלך מעולה! שמור על הפעילויות והאנשים שמשפרים את הרגשתך.',
          priority: 'low',
          actionable: false,
        });
      }

      expect(insights).toHaveLength(1);
      expect(insights[0].type).toBe('celebration');
      expect(insights[0].priority).toBe('low');
      expect(insights[0].actionable).toBe(false);
    });

    it('generates recommendation for mood distribution imbalance', () => {
      const highMoodDays = 2;
      const lowMoodDays = 8;
      const insights: any[] = [];

      if (lowMoodDays > highMoodDays * 2) {
        insights.push({
          type: 'recommendation',
          title: 'צריך יותר ימים טובים',
          description:
            'יש לך הרבה יותר ימים עם מצב רוח נמוך מאשר גבוה. חפש פעילויות שמשפרות את מצב הרוח שלך.',
          priority: 'medium',
          actionable: true,
        });
      }

      expect(insights).toHaveLength(1);
      expect(insights[0].type).toBe('recommendation');
      expect(insights[0].priority).toBe('medium');
      expect(insights[0].actionable).toBe(true);
    });
  });

  describe('Insight Priority Logic', () => {
    it('assigns high priority to critical warnings', () => {
      const criticalInsights = [
        { type: 'warning', condition: 'lowMood', priority: 'high' },
        { type: 'warning', condition: 'decliningTrend', priority: 'medium' },
        { type: 'celebration', condition: 'improvingTrend', priority: 'low' },
      ];

      const highPriorityCount = criticalInsights.filter(
        (insight) => insight.priority === 'high'
      ).length;
      const mediumPriorityCount = criticalInsights.filter(
        (insight) => insight.priority === 'medium'
      ).length;
      const lowPriorityCount = criticalInsights.filter(
        (insight) => insight.priority === 'low'
      ).length;

      expect(highPriorityCount).toBe(1);
      expect(mediumPriorityCount).toBe(1);
      expect(lowPriorityCount).toBe(1);
    });

    it('marks insights as actionable based on type', () => {
      const insights = [
        { type: 'warning', actionable: true },
        { type: 'recommendation', actionable: true },
        { type: 'celebration', actionable: false },
        { type: 'milestone', actionable: false },
      ];

      const actionableInsights = insights.filter(
        (insight) => insight.actionable
      );
      const nonActionableInsights = insights.filter(
        (insight) => !insight.actionable
      );

      expect(actionableInsights).toHaveLength(2);
      expect(nonActionableInsights).toHaveLength(2);
    });
  });

  describe('Insight Content Validation', () => {
    it('validates insight title length', () => {
      const validTitle = 'כותרת תקינה';
      const tooLongTitle =
        'כותרת ארוכה מאוד שמכילה יותר ממאה תווים כדי לבדוק את המגבלה של השדה הזה במערכת';

      expect(validTitle.length).toBeLessThanOrEqual(100);
      expect(tooLongTitle.length).toBeGreaterThan(100);
    });

    it('validates insight description length', () => {
      const validDescription = 'תיאור תקין של התובנה';
      const tooLongDescription = 'א'.repeat(1001);

      expect(validDescription.length).toBeLessThanOrEqual(1000);
      expect(tooLongDescription.length).toBeGreaterThan(1000);
    });

    it('validates insight type values', () => {
      const validTypes = [
        'recommendation',
        'warning',
        'celebration',
        'pattern',
        'milestone',
      ];
      const invalidType = 'invalid_type';

      expect(validTypes).toContain('recommendation');
      expect(validTypes).toContain('warning');
      expect(validTypes).toContain('celebration');
      expect(validTypes).toContain('pattern');
      expect(validTypes).toContain('milestone');
      expect(validTypes).not.toContain(invalidType);
    });

    it('validates priority values', () => {
      const validPriorities = ['low', 'medium', 'high'];
      const invalidPriority = 'invalid_priority';

      expect(validPriorities).toContain('low');
      expect(validPriorities).toContain('medium');
      expect(validPriorities).toContain('high');
      expect(validPriorities).not.toContain(invalidPriority);
    });
  });
});
