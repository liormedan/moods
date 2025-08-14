'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
  Check,
  X,
} from 'lucide-react';

export function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Password validation
  const passwordValidation = {
    length: password.length >= 6,
    match: password === confirmPassword && password.length > 0,
  };

  const isFormValid =
    name.length >= 2 &&
    email.includes('@') &&
    passwordValidation.length &&
    passwordValidation.match;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('ההרשמה הושלמה בהצלחה! מעביר אותך לדף ההתחברות...');
        setTimeout(() => {
          router.push('/auth/signin?message=Registration successful');
        }, 2000);
      } else {
        setError(data.error || 'אירעה שגיאה במהלך ההרשמה');
      }
    } catch {
      setError('אירעה שגיאה. אנא נסה שוב.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          הרשמה
        </CardTitle>
        <CardDescription className="text-center text-gray-600 dark:text-gray-400">
          צור חשבון חדש כדי להתחיל לעקוב אחר מצב הרוח שלך
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              שם מלא
            </Label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="name"
                type="text"
                placeholder="השם המלא שלך"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                className="pr-10 h-11 border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              כתובת אימייל
            </Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="pr-10 h-11 border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              סיסמה
            </Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
                className="pr-10 pl-10 h-11 border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              אישור סיסמה
            </Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
                className="pr-10 pl-10 h-11 border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Password validation indicators */}
          {password.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                דרישות סיסמה:
              </p>
              <div className="flex items-center text-xs">
                {passwordValidation.length ? (
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                ) : (
                  <X className="w-4 h-4 text-red-500 mr-2" />
                )}
                <span
                  className={
                    passwordValidation.length
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }
                >
                  לפחות 6 תווים
                </span>
              </div>
              {confirmPassword.length > 0 && (
                <div className="flex items-center text-xs">
                  {passwordValidation.match ? (
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                  ) : (
                    <X className="w-4 h-4 text-red-500 mr-2" />
                  )}
                  <span
                    className={
                      passwordValidation.match
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }
                  >
                    הסיסמאות תואמות
                  </span>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <span className="text-sm text-red-700 dark:text-red-300">
                {error}
              </span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-sm text-green-700 dark:text-green-300">
                {success}
              </span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                נרשם...
              </div>
            ) : (
              'הירשם'
            )}
          </Button>
        </form>

        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          בהרשמה אתה מסכים ל
          <button className="text-purple-600 hover:text-purple-500 dark:text-purple-400 mx-1">
            תנאי השימוש
          </button>
          ול
          <button className="text-purple-600 hover:text-purple-500 dark:text-purple-400 mx-1">
            מדיניות הפרטיות
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
