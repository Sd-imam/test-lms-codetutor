/**
 * Next.js 16 Proxy for Route Protection
 * Runs on Edge Runtime for optimal performance
 * 
 * NOTE: This is the new Next.js 16 convention (proxy.ts instead of middleware.ts)
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected route patterns
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/instructor',
  '/admin',
]

const authRoutes = [
  '/signin',
  '/signup',
  '/activate',
  '/forgot-password',
  '/oauth',
]

const adminRoutes = [
  '/admin',
]

const instructorRoutes = [
  '/instructor',
]

/**
 * Check if user has valid authentication cookies
 */
function hasAuthCookies(request: NextRequest): boolean {
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  return Boolean(accessToken || refreshToken)
}

/**
 * Get user role from cookies
 * The backend should set this cookie after authentication
 */
function getUserRole(request: NextRequest): string | null {
  // Backend sets 'role' cookie after successful authentication
  const role = request.cookies.get('role')?.value
  return role || null
}

/**
 * Extract role from access token (JWT) if available
 * This is a backup method if role cookie is not set
 */
function getRoleFromToken(request: NextRequest): string | null {
  try {
    const accessToken = request.cookies.get('accessToken')?.value
    if (!accessToken) return null
    
    // Decode JWT payload (base64 decode the middle part)
    const parts = accessToken.split('.')
    if (parts.length !== 3 || !parts[1]) return null
    
    // Use atob (available in Edge Runtime) for base64 decoding
    const payload = JSON.parse(atob(parts[1]))
    return payload.role || null
  } catch {
    return null
  }
}

/**
 * Check if path matches any protected route pattern
 */
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route))
}

/**
 * Check if path is an auth route (signin/signup)
 */
function isAuthRoute(pathname: string): boolean {
  return authRoutes.some(route => pathname.startsWith(route))
}

/**
 * Check if path requires admin access
 */
function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some(route => pathname.startsWith(route))
}

/**
 * Check if path requires instructor access
 */
function isInstructorRoute(pathname: string): boolean {
  return instructorRoutes.some(route => pathname.startsWith(route))
}

/**
 * Main proxy handler for route protection
 * This is the new Next.js 16 convention
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthenticated = hasAuthCookies(request)
  // Try to get role from cookie first, then from JWT token
  const userRole = getUserRole(request) || getRoleFromToken(request)

  // Allow public routes (courses, home, about, contact, etc.)
  if (!isProtectedRoute(pathname) && !isAuthRoute(pathname)) {
    return NextResponse.next()
  }

  // Handle auth routes (signin, signup, activate, etc.)
  if (isAuthRoute(pathname)) {
    // Allow unauthenticated users to access auth pages
    if (!isAuthenticated) {
      return NextResponse.next()
    }
    // Redirect authenticated users away from auth pages to dashboard
    const redirectUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect unauthenticated users to signin
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    const signInUrl = new URL('/signin', request.url)
    // Preserve the original destination for redirect after login
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Check admin access
  if (isAdminRoute(pathname)) {
    if (userRole !== 'admin') {
      // Redirect non-admins to dashboard
      const dashboardUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }

  // Check instructor access
  if (isInstructorRoute(pathname)) {
    if (userRole !== 'instructor' && userRole !== 'admin') {
      // Redirect non-instructors to dashboard
      const dashboardUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }

  // Add security headers
  const response = NextResponse.next()
  
  // Security headers for authenticated routes
  if (isAuthenticated) {
    response.headers.set('X-Authenticated', 'true')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  }

  return response
}

// Configure which routes the proxy should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - API routes (MUST be excluded to allow authentication)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}

