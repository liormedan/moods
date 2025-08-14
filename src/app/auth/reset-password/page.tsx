import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import Link from 'next/link';
import { Heart, ArrowRight, Shield, Key } from 'lucide-react';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex min-h-screen">
        {/* Left side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-green-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Mental Health Tracker
                </h1>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                איפוס סיסמה
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                הכנס סיסמה חדשה לחשבון שלך
              </p>
            </div>

            <ResetPasswordForm />

            <div className="text-center space-y-4">
              <Link
                href="/auth/signin"
                className="inline-flex items-center text-sm text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                חזור לדף ההתחברות
              </Link>
            </div>

            {/* Security note */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start">
                <Key className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                    סיסמה חזקה
                  </h3>
                  <p className="text-xs text-green-600 dark:text-green-300">
                    בחר סיסמה חזקה הכוללת לפחות 6 תווים כדי לשמור על אבטחת החשבון שלך.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-blue-700 p-12 text-white flex-col justify-center">
          <div className="max-w-md">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Key className="w-12 h-12 text-green-200" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                סיסמה חדשה
              </h2>
              <p className="text-xl text-green-100 leading-relaxed">
                כמעט סיימנו! עוד רגע תוכל לחזור לעקוב אחר מצב הרוח שלך
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold mb-2">אבטחה מתקדמת</h3>
                <p className="text-sm text-green-100">
                  הסיסמה החדשה תוצפן ותישמר בצורה מאובטחת
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold mb-2">גישה מיידית</h3>
                <p className="text-sm text-green-100">
                  לאחר איפוס הסיסמה תוכל להתחבר מיד לחשבון
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold mb-2">המשך המעקב</h3>
                <p className="text-sm text-green-100">
                  כל הנתונים שלך נשמרו ומחכים לך
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}