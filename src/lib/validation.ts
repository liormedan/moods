import { z } from 'zod';
import { isValidDate, getMoodEntryDate } from './date-utils';

/**
 * Common validation schemas
 */

// ID validation
export const IdSchema = z.string().cuid('מזהה לא תקין');

// Date validation with custom parsing
export const DateSchema = z.preprocess((val) => {
  if (typeof val === 'string') {
    const date = new Date(val);
    return isValidDate(date) ? date : undefined;
  }
  return val;
}, z.date('תאריך לא תקין'));

// Optional date validation
export const OptionalDateSchema = DateSchema.optional();

// Pagination validation
export const PaginationSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1, 'מספר עמוד חייב להיות לפחות 1')
    .default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100, 'מגבלה מקסימלית היא 100')
    .default(10),
});

// Date range validation
export const DateRangeSchema = z
  .object({
    startDate: DateSchema,
    endDate: DateSchema,
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'תאריך התחלה חייב להיות לפני תאריך הסיום',
    path: ['endDate'],
  });

// Period validation
export const PeriodSchema = z.enum(['week', 'month', 'quarter']);

/**
 * Validation helper functions
 */

/**
 * Validate and sanitize mood value
 */
export function validateMoodValue(value: unknown): number {
  const result = z.coerce.number().int().min(1).max(10).safeParse(value);
  if (!result.success) {
    throw new Error('מצב רוח חייב להיות מספר שלם בין 1 ל-10');
  }
  return result.data;
}

/**
 * Validate and normalize date for mood entry
 */
export function validateMoodEntryDate(date?: unknown): Date {
  if (date === undefined || date === null) {
    return getMoodEntryDate();
  }

  const result = DateSchema.safeParse(date);
  if (!result.success) {
    throw new Error('תאריך לא תקין');
  }

  return getMoodEntryDate(result.data);
}

/**
 * Validate notes text
 */
export function validateNotes(notes?: unknown): string | undefined {
  if (notes === undefined || notes === null || notes === '') {
    return undefined;
  }

  const result = z
    .string()
    .max(500, 'הערות לא יכולות להיות יותר מ-500 תווים')
    .safeParse(notes);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  return result.data.trim() || undefined;
}

/**
 * Validate user ID
 */
export function validateUserId(userId: unknown): string {
  const result = IdSchema.safeParse(userId);
  if (!result.success) {
    throw new Error('מזהה משתמש לא תקין');
  }
  return result.data;
}

/**
 * Validate pagination parameters
 */
export function validatePagination(params: unknown) {
  const result = PaginationSchema.safeParse(params);
  if (!result.success) {
    throw new Error('פרמטרי עמוד לא תקינים');
  }
  return result.data;
}

/**
 * Validate date range
 */
export function validateDateRange(range: unknown) {
  const result = DateRangeSchema.safeParse(range);
  if (!result.success) {
    throw new Error('טווח תאריכים לא תקין');
  }
  return result.data;
}

/**
 * Validate period parameter
 */
export function validatePeriod(period: unknown): 'week' | 'month' | 'quarter' {
  const result = PeriodSchema.safeParse(period);
  if (!result.success) {
    throw new Error('תקופה לא תקינה');
  }
  return result.data;
}

/**
 * Generic validation function with custom error handling
 */
export function validateWithSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorMessage?: string
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const firstError = result.error.issues[0];
    throw new Error(errorMessage || firstError.message);
  }
  return result.data;
}

/**
 * Validation middleware for API routes
 */
export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): T => {
    return validateWithSchema(schema, data, 'נתונים לא תקינים');
  };
}

/**
 * Sanitize HTML content (basic)
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize text input
 */
export function sanitizeTextInput(
  input: string,
  maxLength: number = 1000
): string {
  const sanitized = input.trim().substring(0, maxLength);
  return sanitizeHtml(sanitized);
}

/**
 * Check if string contains only Hebrew characters and common punctuation
 */
export function isHebrewText(text: string): boolean {
  const hebrewRegex = /^[\u0590-\u05FF\s\d.,!?;:()\-"'/]+$/;
  return hebrewRegex.test(text);
}

/**
 * Validate Hebrew text input
 */
export function validateHebrewText(
  text: string,
  fieldName: string = 'טקסט'
): string {
  if (!text.trim()) {
    throw new Error(`${fieldName} לא יכול להיות רק`);
  }

  if (!isHebrewText(text)) {
    throw new Error(`${fieldName} חייב להכיל רק תווים בעברית`);
  }

  return text.trim();
}

/**
 * Rate limiting validation
 */
export const RateLimitSchema = z.object({
  windowMs: z.number().int().min(1000), // At least 1 second
  maxRequests: z.number().int().min(1),
  identifier: z.string().min(1),
});

/**
 * API response validation
 */
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

/**
 * Create standardized API response
 */
export function createApiResponse<T>(
  success: boolean,
  data?: T,
  message?: string,
  error?: string
): ApiResponse<T> {
  return {
    success,
    ...(data !== undefined && { data }),
    ...(message && { message }),
    ...(error && { error }),
  };
}

/**
 * Validate API response
 */
export function validateApiResponse<T>(response: unknown): ApiResponse<T> {
  return validateWithSchema(ApiResponseSchema, response, 'תגובת API לא תקינה');
}
