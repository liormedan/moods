import { z } from 'zod';

// User validation schemas
export const UserRegistrationSchema = z.object({
  name: z
    .string()
    .min(2, 'שם חייב להיות לפחות 2 תווים')
    .max(50, 'שם לא יכול להיות יותר מ-50 תווים')
    .regex(/^[א-ת\s\w]+$/, 'שם יכול להכיל רק אותיות ורווחים'),
  email: z
    .string()
    .email('כתובת אימייל לא תקינה')
    .max(100, 'אימייל לא יכול להיות יותר מ-100 תווים'),
  password: z
    .string()
    .min(6, 'סיסמה חייבת להיות לפחות 6 תווים')
    .max(100, 'סיסמה לא יכולה להיות יותר מ-100 תווים')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'סיסמה חייבת להכיל לפחות אות קטנה, אות גדולה ומספר'
    ),
});

export const UserLoginSchema = z.object({
  email: z.string().email('כתובת אימייל לא תקינה'),
  password: z.string().min(1, 'סיסמה נדרשת'),
});

export const UserUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'שם חייב להיות לפחות 2 תווים')
    .max(50, 'שם לא יכול להיות יותר מ-50 תווים')
    .optional(),
  email: z
    .string()
    .email('כתובת אימייל לא תקינה')
    .max(100, 'אימייל לא יכול להיות יותר מ-100 תווים')
    .optional(),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'סיסמה נוכחית נדרשת'),
    newPassword: z
      .string()
      .min(6, 'סיסמה חדשה חייבת להיות לפחות 6 תווים')
      .max(100, 'סיסמה לא יכולה להיות יותר מ-100 תווים')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'סיסמה חייבת להכיל לפחות אות קטנה, אות גדולה ומספר'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'סיסמאות לא תואמות',
    path: ['confirmPassword'],
  });

// TypeScript types
export type UserRegistrationInput = z.infer<typeof UserRegistrationSchema>;
export type UserLoginInput = z.infer<typeof UserLoginSchema>;
export type UserUpdateInput = z.infer<typeof UserUpdateSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

// User preferences
export interface UserPreferences {
  timezone: string;
  language: 'he' | 'en';
  notifications: {
    dailyReminder: boolean;
    weeklyReport: boolean;
    insightAlerts: boolean;
    reminderTime: string; // HH:MM format
  };
  privacy: {
    shareAnonymousData: boolean;
    allowAnalytics: boolean;
  };
  display: {
    theme: 'light' | 'dark' | 'system';
    chartType: 'line' | 'bar' | 'area';
    dateFormat: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd';
  };
}

// User profile with extended information
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
  // Computed fields
  memberSince: string;
  totalMoodEntries: number;
  currentStreak: number;
  longestStreak: number;
  averageMood: number;
  lastEntryDate?: Date;
}

// User statistics for dashboard
export interface UserStatistics {
  totalDaysTracked: number;
  currentStreak: number;
  longestStreak: number;
  averageMoodAllTime: number;
  averageMoodThisMonth: number;
  totalInsights: number;
  unreadInsights: number;
  memberSinceDays: number;
  completionRate: number; // Percentage of days with entries
}

// User activity summary
export interface UserActivity {
  lastLoginDate: Date;
  lastMoodEntryDate?: Date;
  entriesThisWeek: number;
  entriesThisMonth: number;
  streakStatus: 'active' | 'broken' | 'new';
  nextMilestone: {
    type: 'streak' | 'entries' | 'consistency';
    target: number;
    current: number;
    description: string;
  };
}
