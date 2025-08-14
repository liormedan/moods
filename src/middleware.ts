import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(function middleware(req) {
  if (!req.nextauth?.token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
});

export const config = {
  matcher: ['/dashboard/:path*', '/api/mood/:path*', '/api/insights/:path*'],
};
