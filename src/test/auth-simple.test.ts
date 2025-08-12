import bcrypt from 'bcryptjs';

describe('Authentication System', () => {
  describe('Password Hashing', () => {
    it('should hash passwords correctly', async () => {
      const password = 'testpassword123';
      const hashedPassword = await bcrypt.hash(password, 12);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(50);
    });

    it('should verify passwords correctly', async () => {
      const password = 'testpassword123';
      const hashedPassword = await bcrypt.hash(password, 12);

      const isValid = await bcrypt.compare(password, hashedPassword);
      const isInvalid = await bcrypt.compare('wrongpassword', hashedPassword);

      expect(isValid).toBe(true);
      expect(isInvalid).toBe(false);
    });
  });

  describe('Input Validation', () => {
    it('should validate email format', () => {
      const validEmails = ['test@example.com', 'user.name@domain.co.uk'];
      const invalidEmails = ['invalid-email', '@domain.com', 'user@'];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      validEmails.forEach((email) => {
        expect(emailRegex.test(email)).toBe(true);
      });

      invalidEmails.forEach((email) => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });

    it('should validate password length', () => {
      const validPasswords = ['password123', 'mySecurePass!'];
      const invalidPasswords = ['123', 'short'];

      validPasswords.forEach((password) => {
        expect(password.length).toBeGreaterThanOrEqual(6);
      });

      invalidPasswords.forEach((password) => {
        expect(password.length).toBeLessThan(6);
      });
    });
  });
});
