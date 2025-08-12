import { SignUpForm } from '@/components/auth/signup-form';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            כלי עזר לניהול מצב נפשי
          </h2>
        </div>
        <SignUpForm />
        <div className="text-center">
          <p className="text-sm text-gray-600">
            יש לך כבר חשבון?{' '}
            <Link
              href="/auth/signin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              התחבר כאן
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
