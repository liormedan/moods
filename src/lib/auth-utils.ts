// Auth utilities for Mental Health Tracker
// Supports both admin mode and Firebase authentication

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  isAdmin?: boolean;
}

export interface AuthConfig {
  isAdminMode: boolean;
  skipAuth: boolean;
  useFirebaseEmulator: boolean;
}

// Get authentication configuration from environment variables
export function getAuthConfig(): AuthConfig {
  return {
    isAdminMode: process.env.NEXT_PUBLIC_ADMIN_MODE === 'true',
    skipAuth: process.env.NEXT_PUBLIC_SKIP_AUTH === 'true',
    useFirebaseEmulator: process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATOR === 'true'
  };
}

// Check if user is authenticated (either admin mode or Firebase auth)
export function isAuthenticated(user: AuthUser | null): boolean {
  const config = getAuthConfig();
  
  if (config.skipAuth || config.isAdminMode) {
    return true;
  }
  
  return user !== null && user.id !== undefined;
}

// Get admin user for development
export function getAdminUser(): AuthUser {
  return {
    id: 'admin-dev-001',
    email: 'admin@mentalhealth.local',
    name: 'Development Admin',
    isAdmin: true
  };
}

// Check if current mode is admin mode
export function isAdminMode(): boolean {
  return getAuthConfig().isAdminMode;
}

// Check if authentication should be skipped
export function shouldSkipAuth(): boolean {
  return getAuthConfig().skipAuth;
}

// Check if Firebase emulators should be used
export function shouldUseFirebaseEmulator(): boolean {
  return getAuthConfig().useFirebaseEmulator;
}

// Get authentication status message
export function getAuthStatusMessage(): string {
  const config = getAuthConfig();
  
  if (config.isAdminMode) {
    return 'Running in Admin Mode - No authentication required';
  }
  
  if (config.skipAuth) {
    return 'Running with Authentication Disabled';
  }
  
  if (config.useFirebaseEmulator) {
    return 'Running with Firebase Emulators';
  }
  
  return 'Running with Production Firebase';
}

// Validate user permissions
export function hasPermission(user: AuthUser | null, permission: string): boolean {
  const config = getAuthConfig();
  
  // Admin mode has all permissions
  if (config.isAdminMode) {
    return true;
  }
  
  // No user means no permissions
  if (!user) {
    return false;
  }
  
  // Admin users have all permissions
  if (user.isAdmin) {
    return true;
  }
  
  // Add specific permission checks here
  switch (permission) {
    case 'read:mood':
    case 'write:mood':
    case 'read:journal':
    case 'write:journal':
    case 'read:goals':
    case 'write:goals':
      return true; // All authenticated users can access these
    case 'admin:users':
    case 'admin:system':
      return user.isAdmin === true; // Only admin users
    default:
      return false;
  }
}

// Get user display name
export function getUserDisplayName(user: AuthUser | null): string {
  if (!user) {
    return 'Guest';
  }
  
  if (user.name) {
    return user.name;
  }
  
  if (user.email) {
    return user.email.split('@')[0];
  }
  
  return 'User';
}

// Check if user can access dashboard
export function canAccessDashboard(user: AuthUser | null): boolean {
  return isAuthenticated(user);
}

// Check if user can access admin features
export function canAccessAdminFeatures(user: AuthUser | null): boolean {
  return hasPermission(user, 'admin:system');
}
