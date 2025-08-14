// Firebase types - replacing Prisma types
// This file is kept for compatibility but now uses Firebase-compatible types

// Basic types for Firebase
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MoodEntry {
  id: string;
  userId: string;
  moodValue: number;
  notes?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Insight {
  id: string;
  userId: string;
  type: 'recommendation' | 'warning' | 'celebration';
  title: string;
  description: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
