import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/cart(.*)',
  '/checkout(.*)',
  '/orders(.*)',
  '/profile(.*)',
]);

const isProtectedApiRoute = createRouteMatcher([
  '/api/create-order(.*)',
  '/api/create-order-record(.*)',
  '/api/profile(.*)',
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId } = await auth();
  const { nextUrl } = req;

  // Handle protected routes
  if (isProtectedRoute(req) && !userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Handle protected API routes
  if (isProtectedApiRoute(req) && !userId) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // Simple request logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${nextUrl.pathname} - User: ${userId || 'anonymous'}`);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};