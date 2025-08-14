'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Key,
  Lock,
  Mail,
  Shield,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
  label: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [step, setStep] = useState<'request' | 'verify' | 'reset' | 'success'>(token ? 'reset' : 'request');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) score += 1;
    else feedback.push('לפחות 8 תווים');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('אות קטנה באנגלית');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('אות גדולה באנגלית');

    if (/\d/.test(password)) score += 1;
    else feedback.push('מספר');

    if (/[^\w\s]/.test(password)) score += 1;
    else feedback.push('תו מיוחד');

    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    const labels = ['חלשה מאוד', 'חלשה', 'בינונית', 'חזקה', 'חזקה מאוד'];

    return {
      score,
      feedback,
      color: colors[score] || colors[0],
      label: labels[score] || labels[0]
    };
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/reset-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('קוד אימות נשלח לאימייל שלך');
        setStep('verify');
      } else {
        setError(result.message || 'שגיאה בשליחת קוד האימות');
      }
    } catch (error) {
      setError('שגיאה בחיבור לשרת');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const result = await response.json();

      if (response.ok) {
        setStep('reset');
      } else {
        setError(result.message || 'קוד אימות שגוי');
      }
    } catch (error) {
      setError('שגיאה בחיבור לשרת');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      setLoading(false);
      return;
    }

    const strength = calculatePasswordStrength(newPassword);
    if (strength.score < 3) {
      setError('הסיסמה חלשה מדי. אנא בחר סיסמה חזקה יותר');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          code: verificationCode, 
          newPassword,
          token 
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setStep('success');
      } else {
        setError(result.message || 'שגיאה באיפוס הסיסמה');
      }
    } catch (error) {
      setError('שגיאה בחיבור לשרת');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
            <Key className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            איפוס סיסמה
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {step === 'request' && 'הזן את כתובת האימייל שלך'}
            {step === 'verify' && 'הזן את קוד האימות שנשלח אליך'}
            {step === 'reset' && 'בחר סיסמה חדשה וחזקה'}
            {step === 'success' && 'הסיסמה אופסה בהצלחה!'}
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Step 1: Request Reset */}
            {step === 'request' && (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    כתובת אימייל
                  </label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-700 dark:text-green-300">{success}</span>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Mail className="w-4 h-4 mr-2" />
                  )}
                  {loading ? 'שולח...' : 'שלח קוד אימות'}
                </Button>
              </form>
            )}

            {/* Step 2: Verify Code */}
            {step === 'verify' && (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    קוד אימות
                  </label>
                  <div className="relative mt-1">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="123456"
                      className="pl-10 text-center text-lg tracking-widest"
                      maxLength={6}
                      required
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    הקוד נשלח לכתובת: {email}
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep('request')}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    חזור
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? (
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Shield className="w-4 h-4 mr-2" />
                    )}
                    {loading ? 'מאמת...' : 'אמת קוד'}
                  </Button>
                </div>
              </form>
            )}    
        {/* Step 3: Reset Password */}
            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    סיסמה חדשה
                  </label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="הזן סיסמה חדשה"
                      className="pl-10 pr-10"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {newPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">חוזק הסיסמה:</span>
                      <span className={`text-sm font-medium ${
                        passwordStrength.score >= 4 ? 'text-green-600' :
                        passwordStrength.score >= 3 ? 'text-blue-600' :
                        passwordStrength.score >= 2 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        <span>נדרש: </span>
                        {passwordStrength.feedback.join(', ')}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    אימות סיסמה
                  </label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="הזן שוב את הסיסמה"
                      className="pl-10 pr-10"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">הסיסמאות אינן תואמות</p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && (
                    <p className="text-xs text-green-500 mt-1">הסיסמאות תואמות ✓</p>
                  )}
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                  </div>
                )}

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                    דרישות סיסמה:
                  </h4>
                  <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>
                      ✓ לפחות 8 תווים
                    </li>
                    <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : ''}>
                      ✓ אות קטנה באנגלית
                    </li>
                    <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>
                      ✓ אות גדולה באנגלית
                    </li>
                    <li className={/\d/.test(newPassword) ? 'text-green-600' : ''}>
                      ✓ מספר
                    </li>
                    <li className={/[^\w\s]/.test(newPassword) ? 'text-green-600' : ''}>
                      ✓ תו מיוחד (!@#$%^&*)
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep('verify')}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    חזור
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={loading || passwordStrength.score < 3 || newPassword !== confirmPassword}
                  >
                    {loading ? (
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Key className="w-4 h-4 mr-2" />
                    )}
                    {loading ? 'מאפס...' : 'אפס סיסמה'}
                  </Button>
                </div>
              </form>
            )}

            {/* Step 4: Success */}
            {step === 'success' && (
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    הסיסמה אופסה בהצלחה!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    כעת תוכל להתחבר עם הסיסמה החדשה שלך
                  </p>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={() => router.push('/auth/signin')}
                    className="w-full"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    התחבר עכשיו
                  </Button>
                  
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                      טיפים לאבטחה:
                    </h4>
                    <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                      <li>• אל תשתף את הסיסמה עם אחרים</li>
                      <li>• השתמש בסיסמה ייחודית לכל אתר</li>
                      <li>• שקול להפעיל אימות דו-שלבי</li>
                      <li>• עדכן את הסיסמה מעת לעת</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            זוכר את הסיסמה?{' '}
            <Link href="/auth/signin" className="text-blue-600 hover:text-blue-500 font-medium">
              התחבר כאן
            </Link>
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                הודעת אבטחה
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                מסיבות אבטחה, קישור איפוס הסיסמה תקף ל-24 שעות בלבד. 
                אם לא קיבלת אימייל, בדוק את תיקיית הספאם או נסה שוב.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}