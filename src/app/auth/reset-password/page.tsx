'use client';

import { useState, Suspense } from 'react';
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

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [step, setStep] = useState<'request' | 'verify' | 'reset' | 'success'>(
    token ? 'reset' : 'request'
  );
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

    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-blue-500',
      'bg-green-500',
    ];
    const labels = ['חלשה מאוד', 'חלשה', 'בינונית', 'חזקה', 'חזקה מאוד'];

    return {
      score,
      feedback,
      color: colors[score] || colors[0],
      label: labels[score] || labels[0],
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

      if (response.ok) {
        setSuccess('קוד אימות נשלח לאימייל שלך');
        setStep('verify');
      } else {
        const data = await response.json();
        setError(data.error || 'שגיאה בשליחת קוד האימות');
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

      if (response.ok) {
        setStep('reset');
      } else {
        const data = await response.json();
        setError(data.error || 'קוד אימות שגוי');
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
      setError('הסיסמה חייבת להיות חזקה יותר');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: verificationCode,
          newPassword,
        }),
      });

      if (response.ok) {
        setStep('success');
      } else {
        const data = await response.json();
        setError(data.error || 'שגיאה באיפוס הסיסמה');
      }
    } catch (error) {
      setError('שגיאה בחיבור לשרת');
    } finally {
      setLoading(false);
    }
  };

  const renderRequestStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          איפוס סיסמה
        </h2>
        <p className="text-gray-600">
          הזן את כתובת האימייל שלך ונשלח לך קוד אימות
        </p>
      </div>

      <form onSubmit={handleRequestReset} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            כתובת אימייל
          </label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="הזן את כתובת האימייל שלך"
              className="pr-10"
              required
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading || !email}
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              שולח...
            </>
          ) : (
            <>
              שלח קוד אימות
              <ArrowLeft className="w-4 h-4 mr-2" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/auth/signin"
          className="text-blue-600 hover:text-blue-500 text-sm"
        >
          חזור להתחברות
        </Link>
      </div>
    </div>
  );

  const renderVerifyStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          אימות קוד
        </h2>
        <p className="text-gray-600">
          קוד אימות נשלח ל-{email}
        </p>
      </div>

      <form onSubmit={handleVerifyCode} className="space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
            קוד אימות
          </label>
          <div className="relative">
            <Input
              id="code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="הזן את קוד האימות"
              className="text-center text-lg tracking-widest"
              maxLength={6}
              required
            />
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading || !verificationCode}
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              מאמת...
            </>
          ) : (
            <>
              אמת קוד
              <ArrowLeft className="w-4 h-4 mr-2" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center space-y-2">
        <button
          onClick={() => setStep('request')}
          className="text-blue-600 hover:text-blue-500 text-sm"
        >
          שינוי כתובת אימייל
        </button>
        <div>
          <Link
            href="/auth/signin"
            className="text-gray-600 hover:text-gray-500 text-sm"
          >
            חזור להתחברות
          </Link>
        </div>
      </div>
    </div>
  );

  const renderResetStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          סיסמה חדשה
        </h2>
        <p className="text-gray-600">
          בחר סיסמה חדשה חזקה
        </p>
      </div>

      <form onSubmit={handleResetPassword} className="space-y-4">
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
            סיסמה חדשה
          </label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="הזן סיסמה חדשה"
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {newPassword && (
            <div className="mt-2">
              <div className="flex space-x-1 rtl:space-x-reverse">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-2 flex-1 rounded-full ${
                      level <= calculatePasswordStrength(newPassword).score
                        ? calculatePasswordStrength(newPassword).color
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {calculatePasswordStrength(newPassword).label}
              </p>
              <ul className="text-xs text-gray-500 mt-1 space-y-1">
                {calculatePasswordStrength(newPassword).feedback.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1 text-red-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            אישור סיסמה
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="הזן שוב את הסיסמה החדשה"
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading || !newPassword || !confirmPassword}
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              מאפס סיסמה...
            </>
          ) : (
            <>
              אפס סיסמה
              <ArrowLeft className="w-4 h-4 mr-2" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center">
        <button
          onClick={() => setStep('verify')}
          className="text-blue-600 hover:text-blue-500 text-sm"
        >
          חזור לאימות קוד
        </button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        סיסמה אופסה בהצלחה!
      </h2>
      <p className="text-gray-600">
        הסיסמה שלך אופסה בהצלחה. כעת תוכל להתחבר עם הסיסמה החדשה.
      </p>
      <Button
        onClick={() => router.push('/auth/signin')}
        className="w-full"
      >
        התחבר עכשיו
        <ArrowRight className="w-4 h-4 mr-2" />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">
            איפוס סיסמה
          </CardTitle>
          <CardDescription className="text-gray-600">
            בחר את השיטה המועדפת עליך לאיפוס הסיסמה
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-green-700 text-sm">{success}</span>
              </div>
            </div>
          )}

          {step === 'request' && renderRequestStep()}
          {step === 'verify' && renderVerifyStep()}
          {step === 'reset' && renderResetStep()}
          {step === 'success' && renderSuccessStep()}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">
              טוען...
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <RefreshCw className="w-8 h-8 mx-auto animate-spin text-blue-600" />
          </CardContent>
        </Card>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
