import { User, MoodEntry, Insight } from '@prisma/client';

// Export Prisma types
export type { User, MoodEntry, Insight };

// Re-export specialized types
export * from './mood';
export * from './insights';
export * from './user';

// Extended types with relations
export type UserWithMoodEntries = User & {
  moodEntries: MoodEntry[];
};

export type UserWithInsights = User & {
  insights: Insight[];
};

export type UserWithAll = User & {
  moodEntries: MoodEntry[];
  insights: Insight[];
};

// Legacy types for backward compatibility
export type CreateMoodEntryInput = {
  moodValue: number;
  notes?: string;
  date?: Date;
};

export type UpdateMoodEntryInput = {
  moodValue?: number;
  notes?: string;
};

export type CreateInsightInput = {
  type: 'recommendation' | 'warning' | 'celebration';
  title: string;
  description: string;
};

// Analytics types
export type MoodAnalytics = {
  weeklyAverage: number;
  monthlyAverage: number;
  trend: 'improving' | 'declining' | 'stable';
  streakDays: number;
  totalEntries: number;
};
