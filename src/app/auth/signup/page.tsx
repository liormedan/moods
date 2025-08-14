import { SignUpForm } from '@/components/auth/signup-form';
import Link from 'next/link';
import { Heart, Users, BarChart3, Lock } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex min-h-screen">
        {/* Left side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full space-y-8">
            {/* Mobile header */}
            <div className="text-center lg:hidden">
              <div className="flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-purple-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Mental Health Tracker
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                התחל את המסע שלך לבריאות נפשית טובה יותר
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                צור חשבון חדש
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                הצטרף אלינו והתחל לעקוב אחר מצב הרוח שלך
              </p>
            </div>

            <SignUpForm />

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                יש לך כבר חשבון?{' '}
                <Link
                  href="/auth/signin"
                  className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                >
                  התחבר כאן
                </Link>
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
                מה תקבל:
              </h3>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                  <BarChart3 className="w-4 h-4 text-blue-500 mr-2" />
                  <span>גרפים וניתוחים מתקדמים</span>
                </div>
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4 text-green-500 mr-2" />
                  <span>קהילת תמיכה</span>
                </div>
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                  <Lock className="w-4 h-4 text-purple-500 mr-2" />
                  <span>פרטיות מלאה ואבטחה</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-blue-700 p-12 text-white flex-col justify-center">
          <div className="max-w-md">
            <div className="flex items-center mb-8">
              <Heart className="w-12 h-12 text-pink-300 mr-4" />
              <h1 className="text-3xl font-bold">Mental Health Tracker</h1>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              התחל את המסע שלך
              <br />
              <span className="text-purple-200">לבריאות נפשית טובה יותר</span>
            </h2>
            
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              הצטרף לאלפי משתמשים שכבר משפרים את איכות החיים שלהם
            </p>

            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold mb-2">מעקב יומי</h3>
                <p className="text-sm text-purple-100">
                  תעד את מצב הרוח שלך בכל יום וראה את ההתקדמות
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold mb-2">תובנות חכמות</h3>
                <p className="text-sm text-purple-100">
                  קבל המלצות מותאמות אישית על בסיס הנתונים שלך
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold mb-2">פרטיות מלאה</h3>
                <p className="text-sm text-purple-100">
                  הנתונים שלך מוצפנים ומאובטחים במלואם
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
