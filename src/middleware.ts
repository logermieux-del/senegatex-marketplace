import { withAuth } from 'next-auth/middleware';
import { NextRequest } from 'next/server';

export default withAuth(
  async function middleware(request: NextRequest) {
    // Protect dashboard routes
    const pathname = request.nextUrl.pathname;

    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
      // withAuth will automatically redirect to login if not authenticated
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Specify which routes to protect
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/protected/:path*',
  ],
};
