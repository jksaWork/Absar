import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check if the request is for employee routes
  if (request.nextUrl.pathname.startsWith('/employee/dashboard')) {
    // This is a client-side check, so we'll handle auth in the component
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/employee/:path*']
};
