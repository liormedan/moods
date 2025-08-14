import { SignInForm } from '@/components/auth/signin-form';
import Link from 'next/link';
import { Heart, Shield, TrendingUp } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 text-white flex-col justify-center">
          <div className="max-w-md">
            <div className="flex items-center mb-8">
              <Heart className="w-12 h-12 text-pink-300 mr-4" />
              <h1 className="text-3xl font-bold">Mental Health Tracker</h1>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              עקוב אחר מצב הרוח שלך
              <br />
              <span className="text-blue-200">בצורה חכמה ופשוטה</span>
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              כלי מתקדם לניהול ומעקב אחר הבריאות הנפשית שלך עם תובנות מותאמות אישית
            </p>

            <div className="space-y-4">
              <div className="flex items-center">
                <TrendingUp className="w-6 h-6 text-green-300 mr-3" />
                <span className="text-lg">גרפים וניתוחים מתקדמים</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-6 h-6 text-green-300 mr-3" />
                <span className="text-lg">פרטיות ואבטחה מלאה</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-6 h-6 text-pink-300 mr-3" />
                <span className="text-lg">תמיכה ומעקב אישי</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full space-y-8">
            {/* Mobile header */}
            <div className="text-center lg:hidden">
              <div className="flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Mental Health Tracker
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                עקוב אחר מצב הרוח שלך בצורה חכמה
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                ברוך הבא בחזרה
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                התחבר לחשבון שלך כדי להמשיך
              </p>
            </div>

            <SignInForm />

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                אין לך חשבון?{' '}
                <Link
                  href="/auth/signup"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  הירשם כאן
                </Link>
              </p>
            </div>

            {/* Demo account info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                חשבון דמו
              </h3>
              <p className="text-xs text-blue-600 dark:text-blue-300 mb-2">
                אימייל: demo@example.com
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300">
                סיסמה: demo123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
