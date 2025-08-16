import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';

export default async function middleware(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getSession(req);

    if (!session?.user) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/auth/signin', req.url);
      loginUrl.searchParams.set('returnTo', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // User is authenticated, continue
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware auth error:', error);
    // On error, redirect to login
    const loginUrl = new URL('/auth/signin', req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/mood/:path*',
    '/api/insights/:path*',
    '/api/journal/:path*',
    '/api/goals/:path*',
  ],
};
