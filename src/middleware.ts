import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware() {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes) 
     * - api/graphql (GraphQL endpoint)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - / (home page - allow access without auth)
     */
    "/((?!api/auth|api/graphql|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|$).*)"
  ]
};