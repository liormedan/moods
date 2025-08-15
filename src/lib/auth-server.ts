import { NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';

export async function getAuthenticatedUser(req?: NextRequest, res?: any) {
  try {
    const session = await getSession(req, res);
    
    if (!session?.user?.email) {
      return null;
    }

    return {
      id: session.user.sub || session.user.email,
      email: session.user.email,
      name: session.user.name || null,
      image: session.user.picture || null
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export function createAuthResponse(message: string, status: number = 401) {
  return Response.json({ error: message }, { status });
}