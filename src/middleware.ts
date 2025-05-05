import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  // Check if the request is for an admin route (excluding login)
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login')
  ) {
    // If no token or not admin/instructor, redirect to admin login
    if (!token || (userRole !== 'admin' && userRole !== 'instructor')) {
      return NextResponse.redirect(
        new URL(
          '/admin/login?redirect=' + request.nextUrl.pathname,
          request.url,
        ),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
