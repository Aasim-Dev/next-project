import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
    const isDashboard = req.nextUrl.pathname.startsWith('/dashboard');
    const isApiRoute = req.nextUrl.pathname.startsWith('/api');
    
    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    
    // Redirect unauthenticated users away from protected pages
    if (isDashboard && !isAuth) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
    
    // Role-based access control
    if (isAuth && token) {
      const userRole = token.role as string;
      
      // Admin only routes
      if (req.nextUrl.pathname.startsWith('/admin') && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      
      // Photographer only routes
      if (req.nextUrl.pathname.startsWith('/dashboard/galleries') && userRole !== 'seller') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public pages
        if (req.nextUrl.pathname.startsWith('/api/auth') ||
            req.nextUrl.pathname === '/' ||
            req.nextUrl.pathname.startsWith('/photographers') ||
            req.nextUrl.pathname.startsWith('/galleries') ||
            req.nextUrl.pathname.startsWith('/auth')) {
          return true;
        }
        
        // Require authentication for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
    '/admin/:path*',
    '/api/users/:path*',
    '/api/bookings/:path*',
    '/api/galleries/:path*',
  ],
};