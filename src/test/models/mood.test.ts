import {
  MoodValueSchema,
  CreateMoodEntrySchema,
  UpdateMoodEntrySchema,
} from '@/types/mood';

describe('Mood Data Models', () => {
  describe('MoodValueSchema', () => {
    it('should accept valid mood values (1-10)', () => {
      for (let i = 1; i <= 10; i++) {
        expect(() => MoodValueSchema.parse(i)).not.toThrow();
      }
    });

    it('should reject mood values below 1', () => {
      expect(() => MoodValueSchema.parse(0)).toThrow(
        'מצב רוח חייב להיות לפחות 1'
      );
      expect(() => MoodValueSchema.parse(-1)).toThrow();
    });

    it('should reject mood values above 10', () => {
      expect(() => MoodValueSchema.parse(11)).toThrow(
        'מצב רוח לא יכול להיות יותר מ-10'
      );
      expect(() => MoodValueSchema.parse(15)).toThrow();
    });

    it('should reject non-integer values', () => {
      expect(() => MoodValueSchema.parse(5.5)).toThrow();
      expect(() => MoodValueSchema.parse('5')).toThrow();
    });
  });

  describe('CreateMoodEntrySchema', () => {
    it('should accept valid mood entry data', () => {
      const validData = {
        moodValue: 7,
        notes: 'היום היה יום טוב',
        date: new Date(),
      };

      expect(() => CreateMoodEntrySchema.parse(validData)).not.toThrow();
    });

    it('should accept mood entry without optional fields', () => {
      const minimalData = {
        moodValue: 5,
      };

      expect(() => CreateMoodEntrySchema.parse(minimalData)).not.toThrow();
    });

    it('should reject invalid mood values', () => {
      const invalidData = {
        moodValue: 15,
        notes: 'test',
      };

      expect(() => CreateMoodEntrySchema.parse(invalidData)).toThrow();
    });

    it('should reject notes that are too long', () => {
      const longNotes = 'א'.repeat(501);
      const invalidData = {
        moodValue: 5,
        notes: longNotes,
      };

      expect(() => CreateMoodEntrySchema.parse(invalidData)).toThrow(
        'הערות לא יכולות להיות יותר מ-500 תווים'
      );
    });

    it('should accept empty notes', () => {
      const dataWithEmptyNotes = {
        moodValue: 5,
        notes: '',
      };

      expect(() =>
        CreateMoodEntrySchema.parse(dataWithEmptyNotes)
      ).not.toThrow();
    });
  });

  describe('UpdateMoodEntrySchema', () => {
    it('should accept partial updates', () => {
      const partialUpdate = {
        moodValue: 8,
      };

      expect(() => UpdateMoodEntrySchema.parse(partialUpdate)).not.toThrow();
    });

    it('should accept notes-only updates', () => {
      const notesUpdate = {
        notes: 'עדכון להערות',
      };

      expect(() => UpdateMoodEntrySchema.parse(notesUpdate)).not.toThrow();
    });

    it('should accept empty object', () => {
      expect(() => UpdateMoodEntrySchema.parse({})).not.toThrow();
    });

    it('should reject invalid mood values in updates', () => {
      const invalidUpdate = {
        moodValue: 0,
      };

      expect(() => UpdateMoodEntrySchema.parse(invalidUpdate)).toThrow();
    });
  });
});
