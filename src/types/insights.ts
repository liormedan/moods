import { z } from 'zod';

// Insight types
export const InsightTypeSchema = z.enum([
  'recommendation',
  'warning',
  'celebration',
  'pattern',
  'milestone',
]);

// Insight validation schemas
export const CreateInsightSchema = z.object({
  type: InsightTypeSchema,
  title: z
    .string()
    .min(1, 'כותרת נדרשת')
    .max(100, 'כותרת לא יכולה להיות יותר מ-100 תווים'),
  description: z
    .string()
    .min(1, 'תיאור נדרש')
    .max(1000, 'תיאור לא יכול להיות יותר מ-1000 תווים'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  actionable: z.boolean().default(false),
  expiresAt: z.date().optional(),
});

export const UpdateInsightSchema = z.object({
  isRead: z.boolean().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

// TypeScript types
export type InsightType = z.infer<typeof InsightTypeSchema>;
export type CreateInsightInput = z.infer<typeof CreateInsightSchema>;
export type UpdateInsightInput = z.infer<typeof UpdateInsightSchema>;

// Extended insight interface
export interface InsightWithMetadata {
  id: string;
  userId: string;
  type: InsightType;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  isRead: boolean;
  expiresAt?: Date;
  createdAt: Date;
  // Computed fields
  isExpired: boolean;
  isNew: boolean; // Created in last 24 hours
  category: InsightCategory;
}

// Insight categories for better organization
export type InsightCategory =
  | 'mood_improvement'
  | 'pattern_recognition'
  | 'achievement'
  | 'warning'
  | 'suggestion';

// Insight generation context
export interface InsightGenerationContext {
  userId: string;
  recentMoodEntries: Array<{
    moodValue: number;
    date: Date;
    notes?: string;
  }>;
  moodStatistics: {
    averageMood: number;
    trend: 'improving' | 'declining' | 'stable';
    streakDays: number;
  };
  lastInsightDate?: Date;
}

// Predefined insight templates
export interface InsightTemplate {
  id: string;
  type: InsightType;
  category: InsightCategory;
  titleTemplate: string;
  descriptionTemplate: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  conditions: {
    minMoodValue?: number;
    maxMoodValue?: number;
    trendRequired?: 'improving' | 'declining' | 'stable';
    minStreakDays?: number;
    minEntries?: number;
  };
}

// Insight summary for dashboard
export interface InsightSummary {
  totalInsights: number;
  unreadInsights: number;
  highPriorityInsights: number;
  actionableInsights: number;
  recentInsights: InsightWithMetadata[];
  insightsByType: Record<InsightType, number>;
}
