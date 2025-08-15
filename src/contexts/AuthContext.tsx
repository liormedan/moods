'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, SupabaseUser, SupabaseSession } from '@/lib/supabase'

interface AuthContextType {
  user: SupabaseUser | null
  session: SupabaseSession | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [session, setSession] = useState<SupabaseSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session as SupabaseSession | null)
      setUser(session?.user as SupabaseUser | null)
      setLoading(false)
      
      // Store tokens in cookies for API access
      if (session?.access_token) {
        document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=3600`
      }
      if (session?.refresh_token) {
        document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; max-age=86400`
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session as SupabaseSession | null)
      setUser(session?.user as SupabaseUser | null)
      setLoading(false)
      
      // Update cookies on auth changes
      if (session?.access_token) {
        document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=3600`
        document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; max-age=86400`
      } else {
        // Clear cookies on logout
        document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        document.cookie = 'sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        return { error: error.message }
      }
      
      return {}
    } catch (error) {
      return { error: 'שגיאה בהתחברות' }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        return { error: error.message }
      }
      
      return {}
    } catch (error) {
      return { error: 'שגיאה בהרשמה' }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      
      if (error) {
        return { error: error.message }
      }
      
      return {}
    } catch (error) {
      return { error: 'שגיאה בהתחברות עם Google' }
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}