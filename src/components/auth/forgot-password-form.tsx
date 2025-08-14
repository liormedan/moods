'use client';

import { useState } from 'react';
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
import { Mail, AlertCircle, CheckCircle, Send } from 'lucide-react';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'אירעה שגיאה. אנא נסה שוב.');
      }
    } catch {
      setError('אירעה שגיאה. אנא נסה שוב.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                אימייל נשלח בהצלחה!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                שלחנו קישור לאיפוס הסיסמה לכתובת:
              </p>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-4">
                {email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                בדוק את תיבת הדואר שלך (כולל תיקיית הספאם) ולחץ על הקישור כדי
                לאפס את הסיסמה.
              </p>
            </div>
            <Button
              onClick={() => {
                setSuccess(false);
                setEmail('');
              }}
              variant="outline"
              className="w-full"
            >
              שלח שוב
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          איפוס סיסמה
        </CardTitle>
        <CardDescription className="text-center text-gray-600 dark:text-gray-400">
          הכנס את כתובת האימייל שלך ונשלח לך קישור לאיפוס הסיסמה
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
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
                className="pr-10 h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <span className="text-sm text-red-700 dark:text-red-300">
                {error}
              </span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            disabled={isLoading || !email}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                שולח...
              </div>
            ) : (
              <div className="flex items-center">
                <Send className="w-4 h-4 mr-2" />
                שלח קישור לאיפוס
              </div>
            )}
          </Button>
        </form>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            💡 <strong>טיפ:</strong> אם לא קיבלת את האימייל תוך כמה דקות, בדוק
            את תיקיית הספאם או נסה שוב.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
