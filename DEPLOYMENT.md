# Deployment Guide for HealthShift

This document outlines the deployment process for the HealthShift healthcare workforce management application.

## Vercel Deployment

### Prerequisites
- PostgreSQL database (recommended: Neon, PlanetScale, or Vercel Postgres)
- Auth0 account configured with Google OAuth
- Environment variables properly set in Vercel dashboard

### Environment Variables Required

```bash
# Database
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key
AUTH0_SECRET=your-auth0-secret
AUTH0_BASE_URL=https://your-app.vercel.app
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
```

### Build Process

The application uses the following build process:
1. `npm install` - Install dependencies
2. `prisma generate` - Generate Prisma client
3. `next build` - Build Next.js application

### Key Configuration Files

- `vercel.json` - Vercel deployment configuration
- `next.config.js` - Next.js configuration with PWA and Prisma externals
- `prisma/schema.prisma` - Database schema with Vercel-compatible binary targets

### Troubleshooting

If you encounter Prisma Client issues:
1. Ensure `prisma generate` is running during build
2. Check binary targets in schema.prisma
3. Verify Node.js runtime is specified in API routes

### Post-Deployment Steps

1. Set up database schema: Run `npx prisma db push` or set up migrations
2. Configure Auth0 callback URLs to match your Vercel domain
3. Test authentication and database connectivity