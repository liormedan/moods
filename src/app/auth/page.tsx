'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoginForm from '@/components/auth/LoginForm'
import SignupForm from '@/components/auth/SignupForm'
import { Loader2, Heart, Brain, TrendingUp } from 'lucide-react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">טוען...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 text-white p-12 flex-col justify-center">
        <div className="max-w-md">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center ml-4">
              <Heart className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">Mental Health Tracker</h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-6">
            עקבו אחר מצב הרוח שלכם
          </h2>
          
          <p className="text-xl text-blue-100 mb-8">
            כלי פשוט ויעיל למעקב יומי אחר מצב הרוח, קבלת תובנות אישיות והשגת מטרות בריאות נפשית
          </p>

          <div className="space-y-4">
            <div className="flex items-center">
              <Brain className="w-5 h-5 ml-3 text-blue-200" />
              <span className="text-blue-100">תובנות מבוססות נתונים</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 ml-3 text-blue-200" />
              <span className="text-blue-100">מעקב אחר התקדמות</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-5 h-5 ml-3 text-blue-200" />
              <span className="text-blue-100">שיפור הרווחה הנפשית</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center ml-3">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Mental Health Tracker
              </h1>
            </div>
          </div>

          {/* Auth Forms */}
          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <SignupForm onToggleMode={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  )
}