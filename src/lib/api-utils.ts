import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  details?: any;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

// Success response helpers
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = { data };
  if (message) response.message = message;

  return NextResponse.json(response, { status });
}

export function createdResponse<T>(
  data: T,
  message: string = 'Resource created successfully'
): NextResponse<ApiResponse<T>> {
  return successResponse(data, message, 201);
}

export function updatedResponse<T>(
  data: T,
  message: string = 'Resource updated successfully'
): NextResponse<ApiResponse<T>> {
  return successResponse(data, message, 200);
}

export function deletedResponse(
  message: string = 'Resource deleted successfully'
): NextResponse<ApiResponse> {
  return NextResponse.json({ message }, { status: 200 });
}

// Error response helpers
export function errorResponse(
  error: string,
  status: number = 400,
  details?: any
): NextResponse<ApiResponse> {
  const response: ApiResponse = { error };
  if (details) response.details = details;

  return NextResponse.json(response, { status });
}

export function unauthorizedResponse(
  error: string = 'Unauthorized'
): NextResponse<ApiResponse> {
  return errorResponse(error, 401);
}

export function forbiddenResponse(
  error: string = 'Forbidden'
): NextResponse<ApiResponse> {
  return errorResponse(error, 403);
}

export function notFoundResponse(
  error: string = 'Resource not found'
): NextResponse<ApiResponse> {
  return errorResponse(error, 404);
}

export function conflictResponse(
  error: string = 'Conflict',
  details?: any
): NextResponse<ApiResponse> {
  return errorResponse(error, 409, details);
}

export function validationErrorResponse(
  details: any
): NextResponse<ApiResponse> {
  return errorResponse('Invalid input', 400, details);
}

export function internalErrorResponse(
  error: string = 'Internal server error'
): NextResponse<ApiResponse> {
  return errorResponse(error, 500);
}

// Pagination helpers
export function buildPaginationResponse<T>(
  data: T[],
  total: number,
  limit: number,
  offset: number
): ApiResponse<T[]> {
  return {
    data,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  };
}

// Date validation helpers
export function validateDateRange(
  startDate?: string,
  endDate?: string
): { isValid: boolean; error?: string; start?: Date; end?: Date } {
  if (!startDate || !endDate) {
    return { isValid: false, error: 'Both startDate and endDate are required' };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }

  if (start > end) {
    return { isValid: false, error: 'startDate must be before endDate' };
  }

  return { isValid: true, start, end };
}

export function validatePeriod(period: string): {
  isValid: boolean;
  value?: number;
  error?: string;
} {
  const value = parseInt(period);

  if (isNaN(value) || value <= 0 || value > 365) {
    return {
      isValid: false,
      error: 'Period must be a number between 1 and 365 days',
    };
  }

  return { isValid: true, value };
}

// Input sanitization helpers
export function sanitizeMoodValue(value: any): number | null {
  const num = Number(value);
  return Number.isInteger(num) && num >= 1 && num <= 10 ? num : null;
}

export function sanitizeString(
  value: any,
  maxLength: number = 1000
): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length <= maxLength ? trimmed : null;
}

export function sanitizeDate(value: any): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

// Rate limiting helpers (basic implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

// Clean up old rate limit records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60000); // Clean up every minute
