import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  try {
    return await auth0.middleware(request);
  } catch (error) {
    // Handle JWE Invalid errors by clearing auth cookies and proceeding
    if (error instanceof Error && error.message.includes('Invalid Compact JWE')) {
      console.log('Clearing invalid Auth0 session cookies');
      const response = NextResponse.next();
      // Clear Auth0 cookies that might be corrupted
      response.cookies.delete('auth0.session');
      response.cookies.delete('auth0.is'); 
      response.cookies.delete('a0_state');
      return response;
    }
    throw error;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
  ]
};