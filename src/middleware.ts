import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(req: NextRequest) {
  // Temporarily disabled authentication for demo
  // In a real app, you would check authentication here
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/mood/:path*', '/api/insights/:path*'],
};
