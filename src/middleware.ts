// Temporarily disabled authentication for demo purposes
// import { withAuth } from 'next-auth/middleware';

// export default withAuth(
//   function middleware() {
//     // Add any additional middleware logic here
//   },
//   {
//     callbacks: {
//       authorized: ({ token, req }) => {
//         // Allow all requests for demo
//         return true;
//       },
//     },
//   }
// );

// Allow all requests for demo
export function middleware() {
  return;
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/mood/:path*', '/api/insights/:path*'],
};
