import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import Link from 'next/link';
import { Heart, ArrowRight, Shield } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex min-h-screen">
        {/* Left side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Mental Health Tracker
                </h1>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                שכחת את הסיסמה?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                אל תדאג, נשלח לך קישור לאיפוס הסיסמה
              </p>
            </div>

            <ForgotPasswordForm />

            <div className="text-center space-y-4">
              <Link
                href="/auth/signin"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                חזור לדף ההתחברות
              </Link>
            </div>

            {/* Security note */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                    אבטחה ופרטיות
                  </h3>
                  <p className="text-xs text-blue-600 dark:text-blue-300">
                    הקישור לאיפוס הסיסמה יישלח רק לכתובת האימייל הרשומה בחשבון
                    שלך ויפוג תוך 24 שעות.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-white flex-col justify-center">
          <div className="max-w-md">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-12 h-12 text-blue-200" />
              </div>
              <h2 className="text-3xl font-bold mb-4">אבטחה מתקדמת</h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                אנחנו דואגים לאבטחת החשבון שלך עם הגנות מתקדמות
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold mb-2">הצפנה מלאה</h3>
                <p className="text-sm text-blue-100">
                  כל הנתונים שלך מוצפנים ומאובטחים
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold mb-2">איפוס מאובטח</h3>
                <p className="text-sm text-blue-100">
                  קישורי איפוס סיסמה בטוחים ומוגבלים בזמן
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold mb-2">פרטיות מלאה</h3>
                <p className="text-sm text-blue-100">
                  המידע האישי שלך נשאר פרטי ומוגן
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
