import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log('🔍 Middleware check for:', pathname);

  // Check if the request is for admin routes (except login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Get the token from cookies
    const token = request.cookies.get('admin_token')?.value;

    console.log('🍪 Token found:', token ? 'YES' : 'NO');

    // If no token, redirect to login
    if (!token) {
      console.log('❌ No token, redirecting to login');
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Verify the token
    const payload = await verifyToken(token);

    console.log('✅ Token valid:', payload ? 'YES' : 'NO');

    // If token is invalid or expired, redirect to login
    if (!payload) {
      console.log('❌ Invalid token, redirecting to login');
      const loginUrl = new URL('/admin/login', request.url);
      const response = NextResponse.redirect(loginUrl);

      // Clear the invalid token
      response.cookies.set('admin_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });

      return response;
    }

    console.log('✅ Access granted to:', pathname);
  }

  // If user is logged in and tries to access login page, redirect to dashboard
  if (pathname === '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;

    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        const dashboardUrl = new URL('/admin/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: '/admin/:path*',
};
