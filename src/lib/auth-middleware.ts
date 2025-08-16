import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from './auth-helpers';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

/**
 * Middleware function to protect API routes
 * Returns the authenticated user or null if not authenticated
 */
export async function getAuthenticatedUser(
  request: NextRequest
): Promise<AuthenticatedUser | null> {
  try {
    const dbUser = await getCurrentUser(request);
    
    if (!dbUser) {
      return null;
    }

    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      image: dbUser.image,
    };
  } catch (error) {
    console.error('Auth middleware error:', error);
    return null;
  }
}

/**
 * Wrapper function to protect API routes
 * Returns 401 if user is not authenticated
 */
export function requireAuth(
  handler: (req: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    return handler(request, user);
  };
}

/**
 * Create error response for authentication failures
 */
export function createAuthError(
  message: string = 'Authentication required',
  status: number = 401
) {
  return NextResponse.json({ error: message }, { status });
}

