import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the token with Supabase
    const {
      data: { user },
      error,
    } = await supabaseServer.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export async function findOrCreateUser(supabaseUser: any) {
  try {
    // Try to find existing user
    let user = await prisma.user.findUnique({
      where: { id: supabaseUser.id },
    });

    // If user doesn't exist, create them
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: supabaseUser.id, // Use Supabase UUID
          email: supabaseUser.email,
          name: supabaseUser.user_metadata?.name || null,
          image: supabaseUser.user_metadata?.avatar_url || null,
          emailVerified: supabaseUser.email_confirmed_at
            ? new Date(supabaseUser.email_confirmed_at)
            : null,
        },
      });
    }

    return user;
  } catch (error) {
    console.error('User creation error:', error);
    throw error;
  }
}

// Get current user from cookies (for API routes)
export async function getCurrentUserFromCookies(request: NextRequest) {
  try {
    // Get session from cookies
    const cookieStore = request.cookies;
    const accessToken = cookieStore.get('sb-access-token')?.value;
    const refreshToken = cookieStore.get('sb-refresh-token')?.value;

    if (!accessToken) {
      console.log('❌ No access token found in cookies');
      return null;
    }

    // Verify token with Supabase
    const {
      data: { user },
      error,
    } = await supabaseServer.auth.getUser(accessToken);

    if (error || !user) {
      console.log('❌ Invalid token or user not found:', error?.message);
      return null;
    }

    console.log('✅ User found from token:', user.email);

    // Find or create user in local database
    const dbUser = await findOrCreateUser(user);
    return dbUser;
  } catch (error) {
    console.error('❌ Error getting user from cookies:', error);
    return null;
  }
}

// Alternative: Get user from session header
export async function getCurrentUserFromSession() {
  try {
    // This will work when we have proper session management
    const {
      data: { user },
      error,
    } = await supabaseServer.auth.getUser();

    if (error || !user) {
      return null;
    }

    return await findOrCreateUser(user);
  } catch (error) {
    console.error('❌ Error getting user from session:', error);
    return null;
  }
}

// Get current user dynamically (secure - no fallbacks)
export async function getCurrentUser(request?: NextRequest) {
  try {
    if (request) {
      // Method 1: Try Authorization header
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabaseServer.auth.getUser(token);
        
        if (!error && user) {
          const dbUser = await findOrCreateUser(user);
          if (dbUser) {
            console.log('✅ User found from Authorization header:', dbUser.email);
            return dbUser;
          }
        }
      }
      
      // Method 2: Try cookie-based auth
      const dbUser = await getCurrentUserFromCookies(request);
      if (dbUser) {
        return dbUser;
      }
    }
    
    // Method 3: Try session-based auth
    const dbUser = await getCurrentUserFromSession();
    if (dbUser) {
      return dbUser;
    }
    
    // No fallbacks - return null if no authenticated user found
    console.log('❌ No authenticated user found');
    return null;
  } catch (error) {
    console.error('❌ Error getting current user:', error);
    return null;
  }
}
