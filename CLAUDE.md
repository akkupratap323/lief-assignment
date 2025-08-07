# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Development Server:**
```bash
npm run dev          # Start development server with Turbopack
```

**Database Operations:**
```bash
npx prisma generate  # Generate Prisma client after schema changes
npx prisma db push   # Push schema changes to database
npx prisma studio    # Open database GUI for inspection
```

**Build & Deployment:**
```bash
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

**GraphQL Development:**
- GraphQL playground available at http://localhost:3000/api/graphql
- All GraphQL operations go through single endpoint at `/api/graphql/route.ts`

## Architecture Overview

This is a **Next.js 15 PWA** healthcare shift tracker with location-based clock in/out functionality.

### Core Technology Stack
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** GraphQL with Apollo Server, Prisma ORM, PostgreSQL
- **Authentication:** Auth0 with Google OAuth support
- **State Management:** React Context + Apollo Client caching
- **PWA:** next-pwa with offline capabilities

### Key Architecture Patterns

**Provider Hierarchy (src/app/layout.tsx):**
```
UserProvider (Auth0) 
  → ApolloProvider (GraphQL Client)
    → AppProvider (Global State)
      → App Components
```

**Data Flow:**
1. **Authentication:** Auth0 → AppContext (user state)
2. **Location Services:** Geolocation API → AppContext (location state)  
3. **GraphQL Operations:** Apollo Client → Database via Prisma
4. **Real-time Updates:** GraphQL queries with Apollo caching

**Role-Based Architecture:**
- **MANAGER:** Access to dashboard, analytics, all shifts, organization management
- **CARE_WORKER:** Clock in/out functionality, personal shift history only

### Database Schema (Prisma)

**Core Models:**
- `User` - Auth0 integration, role-based access (MANAGER/CARE_WORKER)
- `Organization` - Location data (lat/lng), configurable radius for perimeter checking
- `Shift` - Time tracking with location verification, optional notes

**Key Relationships:**
- User → Shifts (one-to-many)
- Organization → Shifts (one-to-many)
- Cascading deletes configured for data integrity

### GraphQL Schema Structure

**Location-Based Operations:**
- `isWithinPerimeter` query - Haversine distance calculation for perimeter checking
- Clock in/out mutations require location coordinates
- Location data stored with each shift for audit trail

**Dashboard Analytics:**
- `dashboardStats` - Real-time workforce metrics
- Aggregated queries for average hours, daily clock-ins, weekly staff hours

### Component Architecture

**Core Components:**
- `ClockInOut.tsx` - Care worker interface with location services integration
- `StatsCharts.tsx` - Manager dashboard with Chart.js visualizations
- `ui/` directory - shadcn/ui components for consistent design system

**State Management:**
- `AppContext.tsx` - Global state with useReducer pattern
- Location services automatically initialized on app load
- Error handling for geolocation permission denials

## Environment Configuration

**Setting up Environment Variables:**

1. Copy `.env.example` to `.env.local`
2. Generate secrets:
   ```bash
   # Generate AUTH0_SECRET (32-byte hex)
   openssl rand -hex 32
   
   # Generate NEXTAUTH_SECRET (32-byte hex)
   openssl rand -hex 32
   ```

**Required Environment Variables:**
```env
# Auth0 Configuration (v4.9.0 format)
AUTH0_SECRET=your-32-byte-hex-secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
APP_BASE_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://...

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32-byte-hex-secret

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

**Auth0 Setup Steps:**
1. Create Auth0 application (Regular Web Application)
2. Configure URLs in Auth0 Dashboard:
   - **Allowed Callback URLs**: `http://localhost:3000/auth/callback`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Initiate Login URI**: Leave EMPTY (Auth0 validation requires HTTPS)
3. Copy domain, client ID, and client secret to .env.local

**Auth0 Development Notes:**
- Leave "Initiate Login URI" empty to avoid HTTPS validation errors
- Auth0 will automatically handle login flow without explicit initiate URI
- For production, use HTTPS URLs for all Auth0 configuration

## Development Workflow

**Database Changes:**
1. Modify `prisma/schema.prisma`
2. Run `npx prisma db push` to apply changes
3. Run `npx prisma generate` to update client
4. Update GraphQL typeDefs and resolvers accordingly

**GraphQL Schema Changes:**
1. Update `src/lib/graphql/typeDefs.ts`
2. Update `src/lib/graphql/resolvers.ts` 
3. Update queries/mutations in `src/lib/graphql/queries.ts` and `mutations.ts`
4. Restart dev server to reflect changes

**Adding New Features:**
- Follow existing patterns in component structure
- Use AppContext for global state management
- Implement proper error handling for location services
- Consider role-based access control for new functionality

## Location Services Integration

**Perimeter Checking Logic:**
- Default 2km radius per organization
- Haversine formula for distance calculation
- Client-side and server-side validation
- Graceful fallback when location services unavailable

**Error Handling:**
- Permission denied → Show user-friendly message
- Location unavailable → Allow manual override for managers
- Network issues → Apollo Client automatic retry with caching

## PWA Implementation

**Manifest Configuration:**
- `public/manifest.json` defines PWA metadata
- Icons stored in `public/icons/` directory
- Apple-specific meta tags in layout.tsx
- Offline functionality through next-pwa

**Installation:**
- Automatic install prompts on supported browsers
- Mobile-optimized for healthcare worker usage
- Works offline for basic functionality

## Security Considerations

**Authentication Flow:**
- Auth0 handles all authentication logic
- JWT tokens managed automatically
- Role-based access enforced in GraphQL resolvers

**Location Privacy:**
- Location data only collected during clock in/out
- Stored for shift verification purposes
- No continuous tracking outside of work context

**Data Validation:**
- Prisma schema enforces data integrity
- GraphQL input validation on all mutations
- Server-side perimeter validation prevents spoofing