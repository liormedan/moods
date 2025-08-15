'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Lock, Chrome, CheckCircle } from 'lucide-react'

interface SignupFormProps {
  onToggleMode: () => void
}

export default function SignupForm({ onToggleMode }: SignupFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const { signUp, signInWithGoogle } = useAuth()

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('הסיסמאות לא תואמות')
      setLoading(false)
      return
    }

    // Validate password strength
    if (password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים')
      setLoading(false)
      return
    }

    try {
      const result = await signUp(email, password)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('שגיאה בהרשמה')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await signInWithGoogle()
      if (result.error) {
        setError(result.error)
      }
    } catch (err) {
      setError('שגיאה בהרשמה עם Google')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            הרשמה הושלמה!
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            נשלח אליכם אימייל לאימות החשבון
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              בדקו את תיבת האימייל שלכם ולחצו על הקישור לאימות החשבון
            </p>
            <Button
              onClick={onToggleMode}
              variant="outline"
              className="w-full"
            >
              חזרה להתחברות
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          יצירת חשבון חדש
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          הצטרפו אלינו ותתחילו לעקוב אחר מצב הרוח שלכם
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Google Signup Button */}
        <Button
          onClick={handleGoogleSignup}
          disabled={loading}
          variant="outline"
          className="w-full h-12 text-base font-medium border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin ml-2" />
          ) : (
            <Chrome className="w-5 h-5 ml-2 text-blue-600" />
          )}
          הרשמה עם Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
              או
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              כתובת אימייל
            </Label>
            <div className="relative">
              <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pr-10 h-12"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              סיסמה
            </Label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="לפחות 6 תווים"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10 h-12"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              אימות סיסמה
            </Label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="הזינו שוב את הסיסמה"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pr-10 h-12"
                dir="ltr"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin ml-2" />
                נרשם...
              </>
            ) : (
              'יצירת חשבון'
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            כבר יש לכם חשבון?{' '}
            <button
              onClick={onToggleMode}
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              התחברות
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}