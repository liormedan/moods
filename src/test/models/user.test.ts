import {
  UserRegistrationSchema,
  UserLoginSchema,
  UserUpdateSchema,
  ChangePasswordSchema,
} from '@/types/user';

describe('User Data Models', () => {
  describe('UserRegistrationSchema', () => {
    it('should accept valid registration data', () => {
      const validData = {
        name: 'יוסי כהן',
        email: 'yossi@example.com',
        password: 'Password123',
      };

      expect(() => UserRegistrationSchema.parse(validData)).not.toThrow();
    });

    it('should accept Hebrew names', () => {
      const hebrewNames = ['משה', 'שרה לוי', 'אברהם יצחק'];

      hebrewNames.forEach((name) => {
        const data = {
          name,
          email: 'test@example.com',
          password: 'Password123',
        };
        expect(() => UserRegistrationSchema.parse(data)).not.toThrow();
      });
    });

    it('should accept English names', () => {
      const englishNames = ['John Doe', 'Jane Smith', 'Bob Wilson'];

      englishNames.forEach((name) => {
        const data = {
          name,
          email: 'test@example.com',
          password: 'Password123',
        };
        expect(() => UserRegistrationSchema.parse(data)).not.toThrow();
      });
    });

    it('should reject names that are too short', () => {
      const invalidData = {
        name: 'א',
        email: 'test@example.com',
        password: 'Password123',
      };

      expect(() => UserRegistrationSchema.parse(invalidData)).toThrow(
        'שם חייב להיות לפחות 2 תווים'
      );
    });

    it('should reject names that are too long', () => {
      const longName = 'א'.repeat(51);
      const invalidData = {
        name: longName,
        email: 'test@example.com',
        password: 'Password123',
      };

      expect(() => UserRegistrationSchema.parse(invalidData)).toThrow(
        'שם לא יכול להיות יותר מ-50 תווים'
      );
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid',
        'test@',
        '@example.com',
        'test.example.com',
      ];

      invalidEmails.forEach((email) => {
        const data = {
          name: 'Test User',
          email,
          password: 'Password123',
        };
        expect(() => UserRegistrationSchema.parse(data)).toThrow(
          'כתובת אימייל לא תקינה'
        );
      });
    });

    it('should reject weak passwords', () => {
      const weakPasswords = [
        '123456',
        'password',
        'PASSWORD',
        'Password',
        '12345678',
      ];

      weakPasswords.forEach((password) => {
        const data = {
          name: 'Test User',
          email: 'test@example.com',
          password,
        };
        expect(() => UserRegistrationSchema.parse(data)).toThrow(
          'סיסמה חייבת להכיל לפחות אות קטנה, אות גדולה ומספר'
        );
      });
    });

    it('should reject passwords that are too short', () => {
      const shortPassword = 'Aa1';
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        password: shortPassword,
      };

      expect(() => UserRegistrationSchema.parse(data)).toThrow(
        'סיסמה חייבת להיות לפחות 6 תווים'
      );
    });

    it('should accept strong passwords', () => {
      const strongPasswords = ['Password123', 'MySecure1', 'Test123456'];

      strongPasswords.forEach((password) => {
        const data = {
          name: 'Test User',
          email: 'test@example.com',
          password,
        };
        expect(() => UserRegistrationSchema.parse(data)).not.toThrow();
      });
    });
  });

  describe('UserLoginSchema', () => {
    it('should accept valid login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'anypassword',
      };

      expect(() => UserLoginSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password',
      };

      expect(() => UserLoginSchema.parse(invalidData)).toThrow(
        'כתובת אימייל לא תקינה'
      );
    });

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      expect(() => UserLoginSchema.parse(invalidData)).toThrow('סיסמה נדרשת');
    });
  });

  describe('UserUpdateSchema', () => {
    it('should accept partial updates', () => {
      const updates = [
        { name: 'שם חדש' },
        { email: 'new@example.com' },
        { name: 'שם חדש', email: 'new@example.com' },
      ];

      updates.forEach((update) => {
        expect(() => UserUpdateSchema.parse(update)).not.toThrow();
      });
    });

    it('should accept empty update', () => {
      expect(() => UserUpdateSchema.parse({})).not.toThrow();
    });

    it('should reject invalid email in update', () => {
      const invalidUpdate = { email: 'invalid-email' };
      expect(() => UserUpdateSchema.parse(invalidUpdate)).toThrow();
    });
  });

  describe('ChangePasswordSchema', () => {
    it('should accept valid password change', () => {
      const validData = {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      };

      expect(() => ChangePasswordSchema.parse(validData)).not.toThrow();
    });

    it('should reject when passwords do not match', () => {
      const invalidData = {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword123',
        confirmPassword: 'DifferentPassword123',
      };

      expect(() => ChangePasswordSchema.parse(invalidData)).toThrow(
        'סיסמאות לא תואמות'
      );
    });

    it('should reject weak new password', () => {
      const invalidData = {
        currentPassword: 'OldPassword123',
        newPassword: 'weak',
        confirmPassword: 'weak',
      };

      expect(() => ChangePasswordSchema.parse(invalidData)).toThrow();
    });

    it('should reject empty current password', () => {
      const invalidData = {
        currentPassword: '',
        newPassword: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      };

      expect(() => ChangePasswordSchema.parse(invalidData)).toThrow(
        'סיסמה נוכחית נדרשת'
      );
    });
  });
});
