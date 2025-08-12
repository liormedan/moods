import {
  format,
  startOfDay,
  endOfDay,
  subDays,
  subWeeks,
  subMonths,
  isToday,
  isThisWeek,
  isThisMonth,
  differenceInDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  parseISO,
  isValid,
} from 'date-fns';
import { he } from 'date-fns/locale';

// Hebrew day names
export const HEBREW_DAYS = [
  'ראשון',
  'שני',
  'שלישי',
  'רביעי',
  'חמישי',
  'שישי',
  'שבת',
];

// Hebrew month names
export const HEBREW_MONTHS = [
  'ינואר',
  'פברואר',
  'מרץ',
  'אפריל',
  'מאי',
  'יוני',
  'יולי',
  'אוגוסט',
  'ספטמבר',
  'אוקטובר',
  'נובמבר',
  'דצמבר',
];

/**
 * Format date for display in Hebrew
 */
export function formatDateHebrew(
  date: Date,
  formatStr: string = 'dd/MM/yyyy'
): string {
  return format(date, formatStr, { locale: he });
}

/**
 * Get Hebrew day name
 */
export function getHebrewDayName(date: Date): string {
  return HEBREW_DAYS[date.getDay()];
}

/**
 * Get Hebrew month name
 */
export function getHebrewMonthName(date: Date): string {
  return HEBREW_MONTHS[date.getMonth()];
}

/**
 * Format date for chart display
 */
export function formatDateForChart(date: Date): string {
  return format(date, 'dd/MM');
}

/**
 * Format date for API (ISO string)
 */
export function formatDateForAPI(date: Date): string {
  return date.toISOString();
}

/**
 * Parse date from API response
 */
export function parseDateFromAPI(dateString: string): Date {
  const date = parseISO(dateString);
  if (!isValid(date)) {
    throw new Error(`Invalid date string: ${dateString}`);
  }
  return date;
}

/**
 * Get start and end of day
 */
export function getDayBounds(date: Date): { start: Date; end: Date } {
  return {
    start: startOfDay(date),
    end: endOfDay(date),
  };
}

/**
 * Get date ranges for different periods
 */
export function getDateRange(
  period: 'week' | 'month' | 'quarter',
  baseDate: Date = new Date()
) {
  const today = startOfDay(baseDate);

  switch (period) {
    case 'week':
      return {
        startDate: subDays(today, 6), // Last 7 days including today
        endDate: endOfDay(today),
        label: 'השבוע האחרון',
      };
    case 'month':
      return {
        startDate: subDays(today, 29), // Last 30 days including today
        endDate: endOfDay(today),
        label: 'החודש האחרון',
      };
    case 'quarter':
      return {
        startDate: subDays(today, 89), // Last 90 days including today
        endDate: endOfDay(today),
        label: '3 החודשים האחרונים',
      };
    default:
      throw new Error(`Unsupported period: ${period}`);
  }
}

/**
 * Get week bounds (Sunday to Saturday)
 */
export function getWeekBounds(date: Date = new Date()) {
  return {
    start: startOfWeek(date, { weekStartsOn: 0 }), // Sunday
    end: endOfWeek(date, { weekStartsOn: 0 }), // Saturday
  };
}

/**
 * Get month bounds
 */
export function getMonthBounds(date: Date = new Date()) {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
}

/**
 * Check if date is today
 */
export function isDateToday(date: Date): boolean {
  return isToday(date);
}

/**
 * Check if date is this week
 */
export function isDateThisWeek(date: Date): boolean {
  return isThisWeek(date, { weekStartsOn: 0 });
}

/**
 * Check if date is this month
 */
export function isDateThisMonth(date: Date): boolean {
  return isThisMonth(date);
}

/**
 * Calculate days between dates
 */
export function daysBetween(startDate: Date, endDate: Date): number {
  return differenceInDays(endDate, startDate);
}

/**
 * Generate array of dates between two dates
 */
export function generateDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Get relative time description in Hebrew
 */
export function getRelativeTimeHebrew(date: Date): string {
  const now = new Date();
  const diffInDays = daysBetween(date, now);

  if (diffInDays === 0) {
    return 'היום';
  } else if (diffInDays === 1) {
    return 'אתמול';
  } else if (diffInDays === 2) {
    return 'שלשום';
  } else if (diffInDays <= 6) {
    return `לפני ${diffInDays} ימים`;
  } else if (diffInDays <= 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1 ? 'לפני שבוע' : `לפני ${weeks} שבועות`;
  } else if (diffInDays <= 365) {
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? 'לפני חודש' : `לפני ${months} חודשים`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return years === 1 ? 'לפני שנה' : `לפני ${years} שנים`;
  }
}

/**
 * Validate date input
 */
export function isValidDate(date: any): date is Date {
  return date instanceof Date && isValid(date);
}

/**
 * Get timezone offset in hours
 */
export function getTimezoneOffset(): number {
  return new Date().getTimezoneOffset() / -60;
}

/**
 * Convert UTC date to local date
 */
export function utcToLocal(utcDate: Date): Date {
  return new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
}

/**
 * Convert local date to UTC
 */
export function localToUtc(localDate: Date): Date {
  return new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
}

/**
 * Get start of today in user's timezone
 */
export function getStartOfToday(): Date {
  return startOfDay(new Date());
}

/**
 * Get end of today in user's timezone
 */
export function getEndOfToday(): Date {
  return endOfDay(new Date());
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return startOfDay(date1).getTime() === startOfDay(date2).getTime();
}

/**
 * Get date for mood entry (normalized to start of day)
 */
export function getMoodEntryDate(date?: Date): Date {
  return startOfDay(date || new Date());
}
