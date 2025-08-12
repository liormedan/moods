import {
  validateMoodValue,
  validateMoodEntryDate,
  validateNotes,
  validateUserId,
  validatePagination,
  validatePeriod,
  sanitizeHtml,
  sanitizeTextInput,
  isHebrewText,
  validateHebrewText,
  createApiResponse,
} from '@/lib/validation';

describe('Validation Utils', () => {
  describe('validateMoodValue', () => {
    it('should accept valid mood values', () => {
      for (let i = 1; i <= 10; i++) {
        expect(validateMoodValue(i)).toBe(i);
      }
    });

    it('should coerce string numbers', () => {
      expect(validateMoodValue('5')).toBe(5);
      expect(validateMoodValue('10')).toBe(10);
    });

    it('should reject invalid values', () => {
      const invalidValues = [0, 11, -1, 'invalid', null, undefined, 5.5];

      invalidValues.forEach((value) => {
        expect(() => validateMoodValue(value)).toThrow(
          'מצב רוח חייב להיות מספר שלם בין 1 ל-10'
        );
      });
    });
  });

  describe('validateMoodEntryDate', () => {
    it('should return normalized date for valid input', () => {
      const inputDate = new Date('2024-01-15T15:30:00Z');
      const result = validateMoodEntryDate(inputDate);

      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
    });

    it('should return today when no date provided', () => {
      const result = validateMoodEntryDate();
      const today = new Date();

      expect(result.getDate()).toBe(today.getDate());
      expect(result.getMonth()).toBe(today.getMonth());
      expect(result.getFullYear()).toBe(today.getFullYear());
    });

    it('should handle null and undefined', () => {
      expect(() => validateMoodEntryDate(null)).not.toThrow();
      expect(() => validateMoodEntryDate(undefined)).not.toThrow();
    });

    it('should reject invalid dates', () => {
      expect(() => validateMoodEntryDate('invalid')).toThrow('תאריך לא תקין');
      expect(() => validateMoodEntryDate(123)).toThrow('תאריך לא תקין');
    });
  });

  describe('validateNotes', () => {
    it('should return undefined for empty values', () => {
      expect(validateNotes(undefined)).toBeUndefined();
      expect(validateNotes(null)).toBeUndefined();
      expect(validateNotes('')).toBeUndefined();
    });

    it('should trim and return valid notes', () => {
      expect(validateNotes('  הערות טובות  ')).toBe('הערות טובות');
      expect(validateNotes('הערות')).toBe('הערות');
    });

    it('should reject notes that are too long', () => {
      const longNotes = 'א'.repeat(501);
      expect(() => validateNotes(longNotes)).toThrow(
        'הערות לא יכולות להיות יותר מ-500 תווים'
      );
    });

    it('should return undefined for whitespace-only notes', () => {
      expect(validateNotes('   ')).toBeUndefined();
      expect(validateNotes('\t\n')).toBeUndefined();
    });
  });

  describe('validateUserId', () => {
    it('should accept valid CUID', () => {
      const validCuid = 'cl9ebqhxk00008eqf5jvw2e73';
      expect(validateUserId(validCuid)).toBe(validCuid);
    });

    it('should reject invalid IDs', () => {
      const invalidIds = ['', 'invalid', 123, null, undefined];

      invalidIds.forEach((id) => {
        expect(() => validateUserId(id)).toThrow('מזהה משתמש לא תקין');
      });
    });
  });

  describe('validatePagination', () => {
    it('should return default values for empty input', () => {
      const result = validatePagination({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should coerce string numbers', () => {
      const result = validatePagination({ page: '2', limit: '20' });
      expect(result.page).toBe(2);
      expect(result.limit).toBe(20);
    });

    it('should reject invalid values', () => {
      expect(() => validatePagination({ page: 0 })).toThrow();
      expect(() => validatePagination({ limit: 101 })).toThrow();
      expect(() => validatePagination({ page: -1 })).toThrow();
    });
  });

  describe('validatePeriod', () => {
    it('should accept valid periods', () => {
      expect(validatePeriod('week')).toBe('week');
      expect(validatePeriod('month')).toBe('month');
      expect(validatePeriod('quarter')).toBe('quarter');
    });

    it('should reject invalid periods', () => {
      const invalidPeriods = ['day', 'year', 'invalid', 123, null];

      invalidPeriods.forEach((period) => {
        expect(() => validatePeriod(period)).toThrow('תקופה לא תקינה');
      });
    });
  });

  describe('sanitizeHtml', () => {
    it('should escape HTML characters', () => {
      const input = '<script>alert("xss")</script>';
      const expected =
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;';
      expect(sanitizeHtml(input)).toBe(expected);
    });

    it('should handle empty string', () => {
      expect(sanitizeHtml('')).toBe('');
    });

    it('should escape quotes and slashes', () => {
      expect(sanitizeHtml('"test"')).toBe('&quot;test&quot;');
      expect(sanitizeHtml("'test'")).toBe('&#x27;test&#x27;');
      expect(sanitizeHtml('test/path')).toBe('test&#x2F;path');
    });
  });

  describe('sanitizeTextInput', () => {
    it('should trim and sanitize text', () => {
      const input = '  <script>test</script>  ';
      const result = sanitizeTextInput(input);
      expect(result).toBe('&lt;script&gt;test&lt;&#x2F;script&gt;');
    });

    it('should respect max length', () => {
      const longInput = 'a'.repeat(100);
      const result = sanitizeTextInput(longInput, 50);
      expect(result).toHaveLength(50);
    });
  });

  describe('isHebrewText', () => {
    it('should accept Hebrew text', () => {
      const hebrewTexts = [
        'שלום עולם',
        'זה טקסט בעברית',
        'מצב רוח טוב!',
        'היום 15/1/2024',
        'ציון: 8.5',
      ];

      hebrewTexts.forEach((text) => {
        expect(isHebrewText(text)).toBe(true);
      });
    });

    it('should reject non-Hebrew text', () => {
      const nonHebrewTexts = [
        'Hello world',
        'Mixed שלום text',
        'עברית with English',
        '中文',
      ];

      nonHebrewTexts.forEach((text) => {
        expect(isHebrewText(text)).toBe(false);
      });
    });

    it('should accept Hebrew with numbers and punctuation', () => {
      expect(isHebrewText('מצב רוח: 8/10')).toBe(true);
      expect(isHebrewText('היום (15.1.2024) היה טוב!')).toBe(true);
      expect(isHebrewText('שאלה?')).toBe(true);
    });
  });

  describe('validateHebrewText', () => {
    it('should accept valid Hebrew text', () => {
      const text = 'טקסט בעברית';
      expect(validateHebrewText(text)).toBe(text);
    });

    it('should trim whitespace', () => {
      const text = '  טקסט בעברית  ';
      expect(validateHebrewText(text)).toBe('טקסט בעברית');
    });

    it('should reject empty text', () => {
      expect(() => validateHebrewText('')).toThrow('טקסט לא יכול להיות רק');
      expect(() => validateHebrewText('   ')).toThrow('טקסט לא יכול להיות רק');
    });

    it('should reject non-Hebrew text', () => {
      expect(() => validateHebrewText('English text')).toThrow(
        'טקסט חייב להכיל רק תווים בעברית'
      );
    });

    it('should use custom field name in error', () => {
      expect(() => validateHebrewText('English', 'שם')).toThrow(
        'שם חייב להכיל רק תווים בעברית'
      );
    });
  });

  describe('createApiResponse', () => {
    it('should create success response', () => {
      const response = createApiResponse(true, { id: 1 }, 'Success');
      expect(response).toEqual({
        success: true,
        data: { id: 1 },
        message: 'Success',
      });
    });

    it('should create error response', () => {
      const response = createApiResponse(
        false,
        undefined,
        undefined,
        'Error occurred'
      );
      expect(response).toEqual({
        success: false,
        error: 'Error occurred',
      });
    });

    it('should omit undefined fields', () => {
      const response = createApiResponse(true);
      expect(response).toEqual({
        success: true,
      });
      expect(response).not.toHaveProperty('data');
      expect(response).not.toHaveProperty('message');
      expect(response).not.toHaveProperty('error');
    });
  });
});
