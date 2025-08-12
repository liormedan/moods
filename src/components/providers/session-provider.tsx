'use client';

// Temporarily disable NextAuth for demo purposes
// import { SessionProvider } from 'next-auth/react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Temporarily return children without SessionProvider for demo purposes
  return <>{children}</>;
}
