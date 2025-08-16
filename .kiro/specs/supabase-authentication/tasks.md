# Implementation Plan - Supabase Authentication

- [x] 1. Create Supabase project and configure authentication
  - Go to https://supabase.com and create free account
  - Create new project with name "Mental Health Tracker"
  - Wait for project to be ready (2-3 minutes)
  - Go to Authentication > Settings and enable Email authentication
  - Enable Google OAuth provider in Authentication > Providers
  - Copy Project URL and anon public key from Settings > API

  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 2. Install Supabase client and update environment variables
  - Install Supabase JavaScript client: npm install @supabase/supabase-js
  - Add NEXT_PUBLIC_SUPABASE_URL to .env.local with project URL
  - Add NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local with anon key

  - Add SUPABASE_SERVICE_ROLE_KEY for server-side operations
  - Verify environment variables are loaded correctly
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 3. Create Supabase client configuration
  - Create src/lib/supabase.ts with client configuration

  - Set up browser client for frontend operations
  - Set up server client for API route operations
  - Add TypeScript types for Supabase user and session
  - Test basic Supabase connection
  - _Requirements: 5.2, 5.3_

- [x] 4. Create authentication context and hooks
  - Create src/contexts/AuthContext.tsx for authentication state
  - Implement useAuth hook with sign in, sign up, sign out functions
  - Add authentication state management with React context
  - Handle authentication loading states and errors
  - Add Google OAuth sign-in functionality
  - Test authentication context in development
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 5. Update mood stats API route with Supabase authentication
  - Replace demo user lookup with Supabase JWT verification
  - Extract user ID from Supabase session token
  - Update database queries to filter by authenticated user's ID
  - Add proper error handling for unauthenticated requests
  - Implement user creation logic for first-time Supabase users
  - Test API endpoint with Supabase authentication
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 6.1, 6.2, 6.3_

- [ ] 6. Update mood entries API route with Supabase authentication
  - Add Supabase JWT verification to GET and POST methods
  - Update mood entry creation to associate with Supabase user ID
  - Ensure mood entry queries are scoped to current user only
  - Add authentication error responses for unauthorized access
  - Test mood entry creation and retrieval with real users
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 6.1, 6.2, 6.3_

- [ ] 7. Update insights API route with Supabase authentication
  - Replace demo user lookup with Supabase session verification
  - Update insights queries to filter by authenticated user's ID
  - Add proper error handling for authentication failures
  - Test insights API with multiple authenticated users
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 6.1, 6.2, 6.3_

- [ ] 8. Update mood individual entry API route with Supabase authentication
  - Add Supabase JWT verification to PUT and DELETE handlers
  - Verify user ownership before allowing mood entry modifications
  - Update database operations to include user ID verification
  - Add authorization checks to prevent cross-user data access
  - Test mood entry editing and deletion with user isolation
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 6.1, 6.2, 6.3_

- [ ] 9. Update profile API route with Supabase authentication
  - Replace mock profile data with real Supabase user information
  - Implement profile creation from Supabase user metadata
  - Calculate user-specific statistics from their data only

  - Add session validation and error handling
  - Test profile management with real authenticated users
  - _Requirements: 5.1, 5.4, 6.1, 6.2_

- [ ] 10. Update settings API route with Supabase authentication
  - Add Supabase JWT verification to settings GET and PUT handlers
  - Implement user-specific settings storage and retrieval
  - Add proper error handling for unauthenticated requests
  - Test settings persistence across user sessions
  - _Requirements: 4.1, 4.2, 6.1, 6.2_

- [ ] 11. Create authentication UI components
  - Create login form component with email/password fields
  - Create signup form component with validation
  - Add Google OAuth login button
  - Implement logout functionality in dashboard
  - Add loading states and error message displays
  - Style authentication forms to match app design
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 12. Test complete authentication flow and data isolation
  - Create multiple test user accounts in Supabase
  - Verify each user can sign up and log in successfully
  - Test that users see only their own mood entries and data
  - Verify API endpoints reject unauthenticated requests
  - Test session management and logout functionality
  - Confirm no cross-user data access in any API endpoint
  - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4, 4.5_
