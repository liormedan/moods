import {
  formatDateHebrew,
  getHebrewDayName,
  getHebrewMonthName,
  formatDateForChart,
  getDateRange,
  isDateToday,
  isDateThisWeek,
  isDateThisMonth,
  daysBetween,
  generateDateRange,
  getRelativeTimeHebrew,
  isValidDate,
  isSameDay,
  getMoodEntryDate,
} from '@/lib/date-utils';

describe('Date Utils', () => {
  const testDate = new Date('2024-01-15T10:30:00Z'); // Monday, January 15, 2024

  describe('formatDateHebrew', () => {
    it('should format date in Hebrew locale', () => {
      const formatted = formatDateHebrew(testDate);
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('should accept custom format string', () => {
      const formatted = formatDateHebrew(testDate, 'yyyy-MM-dd');
      expect(formatted).toBe('2024-01-15');
    });
  });

  describe('getHebrewDayName', () => {
    it('should return correct Hebrew day names', () => {
      const sunday = new Date('2024-01-14'); // Sunday
      const monday = new Date('2024-01-15'); // Monday
      const saturday = new Date('2024-01-20'); // Saturday

      expect(getHebrewDayName(sunday)).toBe('ראשון');
      expect(getHebrewDayName(monday)).toBe('שני');
      expect(getHebrewDayName(saturday)).toBe('שבת');
    });
  });

  describe('getHebrewMonthName', () => {
    it('should return correct Hebrew month names', () => {
      const january = new Date('2024-01-15');
      const december = new Date('2024-12-15');

      expect(getHebrewMonthName(january)).toBe('ינואר');
      expect(getHebrewMonthName(december)).toBe('דצמבר');
    });
  });

  describe('formatDateForChart', () => {
    it('should format date for chart display', () => {
      const formatted = formatDateForChart(testDate);
      expect(formatted).toBe('15/01');
    });
  });

  describe('getDateRange', () => {
    const baseDate = new Date('2024-01-15');

    it('should return correct week range', () => {
      const range = getDateRange('week', baseDate);
      expect(range.label).toBe('השבוע האחרון');
      expect(daysBetween(range.startDate, range.endDate)).toBe(6);
    });

    it('should return correct month range', () => {
      const range = getDateRange('month', baseDate);
      expect(range.label).toBe('החודש האחרון');
      expect(daysBetween(range.startDate, range.endDate)).toBe(29);
    });

    it('should return correct quarter range', () => {
      const range = getDateRange('quarter', baseDate);
      expect(range.label).toBe('3 החודשים האחרונים');
      expect(daysBetween(range.startDate, range.endDate)).toBe(89);
    });

    it('should throw error for invalid period', () => {
      expect(() => getDateRange('invalid' as any)).toThrow(
        'Unsupported period: invalid'
      );
    });
  });

  describe('date checking functions', () => {
    beforeEach(() => {
      // Mock current date to be consistent
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should correctly identify today', () => {
      const today = new Date('2024-01-15');
      const yesterday = new Date('2024-01-14');

      expect(isDateToday(today)).toBe(true);
      expect(isDateToday(yesterday)).toBe(false);
    });

    it('should correctly identify this week', () => {
      const thisWeek = new Date('2024-01-16'); // Tuesday
      const lastWeek = new Date('2024-01-07'); // Sunday of previous week

      expect(isDateThisWeek(thisWeek)).toBe(true);
      expect(isDateThisWeek(lastWeek)).toBe(false);
    });

    it('should correctly identify this month', () => {
      const thisMonth = new Date('2024-01-20');
      const lastMonth = new Date('2023-12-15');

      expect(isDateThisMonth(thisMonth)).toBe(true);
      expect(isDateThisMonth(lastMonth)).toBe(false);
    });
  });

  describe('daysBetween', () => {
    it('should calculate days between dates correctly', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-05');

      expect(daysBetween(start, end)).toBe(4);
    });

    it('should return 0 for same date', () => {
      const date = new Date('2024-01-01');
      expect(daysBetween(date, date)).toBe(0);
    });
  });

  describe('generateDateRange', () => {
    it('should generate array of dates', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-03');
      const dates = generateDateRange(start, end);

      expect(dates).toHaveLength(3);
      expect(dates[0]).toEqual(start);
      expect(dates[2]).toEqual(end);
    });

    it('should handle single day range', () => {
      const date = new Date('2024-01-01');
      const dates = generateDateRange(date, date);

      expect(dates).toHaveLength(1);
      expect(dates[0]).toEqual(date);
    });
  });

  describe('getRelativeTimeHebrew', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return correct Hebrew relative time', () => {
      const today = new Date('2024-01-15');
      const yesterday = new Date('2024-01-14');
      const dayBeforeYesterday = new Date('2024-01-13');
      const lastWeek = new Date('2024-01-08');
      const lastMonth = new Date('2023-12-15');

      expect(getRelativeTimeHebrew(today)).toBe('היום');
      expect(getRelativeTimeHebrew(yesterday)).toBe('אתמול');
      expect(getRelativeTimeHebrew(dayBeforeYesterday)).toBe('שלשום');
      expect(getRelativeTimeHebrew(lastWeek)).toBe('לפני שבוע');
      expect(getRelativeTimeHebrew(lastMonth)).toBe('לפני חודש');
    });
  });

  describe('isValidDate', () => {
    it('should validate dates correctly', () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date('2024-01-15'))).toBe(true);
      expect(isValidDate(new Date('invalid'))).toBe(false);
      expect(isValidDate('2024-01-15')).toBe(false);
      expect(isValidDate(null)).toBe(false);
      expect(isValidDate(undefined)).toBe(false);
    });
  });

  describe('isSameDay', () => {
    it('should compare days correctly', () => {
      const date1 = new Date('2024-01-15T10:00:00Z');
      const date2 = new Date('2024-01-15T20:00:00Z');
      const date3 = new Date('2024-01-16T10:00:00Z');

      expect(isSameDay(date1, date2)).toBe(true);
      expect(isSameDay(date1, date3)).toBe(false);
    });
  });

  describe('getMoodEntryDate', () => {
    it('should normalize date to start of day', () => {
      const inputDate = new Date('2024-01-15T15:30:45Z');
      const normalized = getMoodEntryDate(inputDate);

      expect(normalized.getHours()).toBe(0);
      expect(normalized.getMinutes()).toBe(0);
      expect(normalized.getSeconds()).toBe(0);
      expect(normalized.getMilliseconds()).toBe(0);
    });

    it('should use current date when no date provided', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T15:30:45Z'));

      const normalized = getMoodEntryDate();
      expect(normalized.getDate()).toBe(15);
      expect(normalized.getMonth()).toBe(0); // January
      expect(normalized.getFullYear()).toBe(2024);

      jest.useRealTimers();
    });
  });
});
