import { z } from 'zod';

// Mood value validation (1-10 scale)
export const MoodValueSchema = z
  .number()
  .int()
  .min(1, 'מצב רוח חייב להיות לפחות 1')
  .max(10, 'מצב רוח לא יכול להיות יותר מ-10');

// Mood entry validation schemas
export const CreateMoodEntrySchema = z.object({
  moodValue: MoodValueSchema,
  notes: z
    .string()
    .max(500, 'הערות לא יכולות להיות יותר מ-500 תווים')
    .optional(),
  date: z.date().optional(),
});

export const UpdateMoodEntrySchema = z.object({
  moodValue: MoodValueSchema.optional(),
  notes: z
    .string()
    .max(500, 'הערות לא יכולות להיות יותר מ-500 תווים')
    .optional(),
});

// TypeScript types derived from schemas
export type MoodValue = z.infer<typeof MoodValueSchema>;
export type CreateMoodEntryInput = z.infer<typeof CreateMoodEntrySchema>;
export type UpdateMoodEntryInput = z.infer<typeof UpdateMoodEntrySchema>;

// Mood entry with computed fields
export interface MoodEntryWithMetadata {
  id: string;
  userId: string;
  moodValue: number;
  notes?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  // Computed fields
  dayOfWeek: string;
  isToday: boolean;
  isThisWeek: boolean;
  isThisMonth: boolean;
}

// Mood statistics
export interface MoodStatistics {
  totalEntries: number;
  averageMood: number;
  highestMood: number;
  lowestMood: number;
  currentStreak: number;
  longestStreak: number;
  entriesThisWeek: number;
  entriesThisMonth: number;
  weeklyAverage: number;
  monthlyAverage: number;
}

// Mood trends
export type MoodTrend = 'improving' | 'declining' | 'stable';

export interface MoodTrendAnalysis {
  trend: MoodTrend;
  trendStrength: number; // 0-1, how strong the trend is
  daysAnalyzed: number;
  changePercentage: number;
  description: string;
}

// Date range for queries
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// Mood chart data point
export interface MoodChartDataPoint {
  date: string;
  mood: number;
  notes?: string;
  dayOfWeek: string;
}

// Mood summary for different periods
export interface MoodPeriodSummary {
  period: 'week' | 'month' | 'quarter';
  startDate: Date;
  endDate: Date;
  averageMood: number;
  entryCount: number;
  highestMood: number;
  lowestMood: number;
  trend: MoodTrend;
}
