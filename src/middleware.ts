import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserById } from '@/domain/lib/users';
import { canAccessRoute, isPublicRoute } from '@/domain/lib/roles';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Allow public routes (e.g., /login, /api/auth)
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // 3. Check for session cookie
  const sessionCookie = request.cookies.get('session');
  if (!sessionCookie?.value) {
    // Not logged in → redirect to login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Look up user and role
  const user = getUserById(sessionCookie.value);
  if (!user) {
    // Invalid session cookie → clear it and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session');
    return response;
  }

  // 5. Enforce RBAC
  if (!canAccessRoute(user.role, pathname)) {
    // Not authorized
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // 6. Authorized → pass role along in headers for downstream API routes
  const response = NextResponse.next();
  response.headers.set('x-user-role', user.role);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
