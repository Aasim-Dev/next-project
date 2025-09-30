// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  role: 'buyer' | 'seller' | 'admin';
}

export async function middleware(request: NextRequest) {
  console.log('Middleware triggered:', request.nextUrl.pathname);
  const { pathname } = request.nextUrl;
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register'];
  const isPublicRoute = publicRoutes.some(route => pathname === route);
  
  // Auth routes that authenticated users shouldn't access
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.includes(pathname);
  console.log(isAuthRoute + " " + token);
  
  // If accessing auth routes and already authenticated, redirect to appropriate dashboard
  if (token) { //isAuthRoute &&
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
      const redirectMap = {
        admin: '/admin/dashboard',
        seller: '/seller/dashboard',
        buyer: '/buyer/dashboard',
      };
      return NextResponse.redirect(new URL(redirectMap[decoded.role], request.url));
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
    if (pathname.startsWith('/admin')) {
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
    
    // Seller-only routes
    if (pathname.startsWith('/seller')) {
      if (userRole !== 'seller') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
    
    // Buyer-only routes
    if (pathname.startsWith('/buyer')) {
      if (userRole !== 'buyer') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
    
    // Old /dashboard route - redirect to role-specific dashboard
    if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
      const redirectMap = {
        admin: '/admin/dashboard',
        seller: '/seller/dashboard',
        buyer: '/buyer/dashboard',
      };
      return NextResponse.redirect(new URL(redirectMap[userRole], request.url));
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
    '/admin/:path*',
    '/seller/:path*',
    '/buyer/:path*',
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
};