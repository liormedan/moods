import { SignInForm } from '@/components/auth/signin-form';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            כלי עזר לניהול מצב נפשי
          </h2>
        </div>
        <SignInForm />
        <div className="text-center">
          <p className="text-sm text-gray-600">
            אין לך חשבון?{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              הירשם כאן
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
