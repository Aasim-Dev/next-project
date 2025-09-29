import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  role: 'buyer' | 'seller' | 'admin';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register'];
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // Auth routes that authenticated users shouldn't access
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.includes(pathname);
  
  // If accessing auth routes and already authenticated, redirect to dashboard
  if (isAuthRoute && token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      // Invalid token, allow access to auth routes
      return NextResponse.next();
    }
  }
  
  // If accessing public routes, allow
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Protected routes require authentication
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Verify token and check role-based access
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    const userRole = decoded.role;
    
    // Role-based route protection
    
    // Admin-only routes
    if (pathname.startsWith('/dashboard/users') ||
        pathname.startsWith('/dashboard/photographers') && !pathname.includes('/dashboard/photographers/')) {
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    
    // Seller-only routes
    if (pathname.startsWith('/dashboard/portfolio') ||
        pathname.startsWith('/dashboard/earnings') ||
        pathname.startsWith('/dashboard/profile')) {
      if (userRole !== 'seller') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    
    // Allow access if all checks pass
    return NextResponse.next();
    
  } catch (error) {
    // Invalid token, redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
};