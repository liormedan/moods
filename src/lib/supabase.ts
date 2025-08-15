import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client for frontend operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server client for API routes (same as browser client for now)
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey)

// Types for Supabase user
export interface SupabaseUser {
  id: string
  email: string
  user_metadata?: {
    name?: string
    avatar_url?: string
  }
}

export interface SupabaseSession {
  user: SupabaseUser
  access_token: string
  refresh_token: string
  expires_at: number
}