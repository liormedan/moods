'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: () => void;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: auth0User, isLoading, error } = useUser();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
      return;
    }

    if (auth0User) {
      // Transform Auth0 user to our format
      const transformedUser: AuthUser = {
        id: auth0User.sub || '',
        email: auth0User.email || '',
        name: auth0User.name || undefined,
        picture: auth0User.picture || undefined,
      };
      setUser(transformedUser);
      setLoading(false);
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [auth0User, isLoading]);

  const signIn = () => {
    // Redirect to Auth0 login
    window.location.href = '/api/auth/login';
  };

  const signOut = () => {
    // Redirect to Auth0 logout
    window.location.href = '/api/auth/logout';
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };

  if (error) {
    console.error('Auth0 error:', error);
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
