# 🏥 HealthShift - Advanced Healthcare Workforce Management System

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)](https://graphql.org/)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**A cutting-edge Progressive Web Application for healthcare organizations to manage their workforce with intelligent location-based shift tracking, automatic geofencing notifications, and comprehensive analytics.**

[🚀 Live Demo](https://lief-assignment-xq7a.vercel.app/) • [📱 Install as PWA](#-pwa-installation) • [📖 Tutorial](https://lief-assignment-xq7a.vercel.app/tutorial)

</div>

---

## 🌟 Executive Summary

HealthShift revolutionizes healthcare workforce management by combining modern web technologies with intelligent location services. This comprehensive solution enables healthcare organizations to accurately track staff shifts through GPS-verified clock in/out functionality, automatic perimeter notifications, and powerful analytics - all wrapped in a beautiful, mobile-first Progressive Web App.

## ✨ Key Features & Innovations

### 🎯 **Smart Geofencing & Location Services**
- **Automatic Perimeter Detection**: AI-powered notifications when care workers enter/exit work locations
- **Intelligent Clock Reminders**: Background location tracking with smart notifications
- **GPS-Verified Time Tracking**: Prevent time fraud with location-based validation
- **Configurable Work Zones**: Custom radius settings for each healthcare facility
- **Offline Location Sync**: Queue location data when offline, sync when connected

### 🔐 **Advanced Authentication & Security**
- **Multi-Provider Auth**: Google OAuth + Email authentication via Auth0
- **Role-Based Access Control**: Granular permissions for managers and care workers
- **Manager Access Verification**: Elegant 4-second overlay confirming authorized access
- **Secure Session Management**: JWT tokens with automatic refresh
- **Data Encryption**: End-to-end security for sensitive healthcare data

### 📱 **Progressive Web App Excellence**
- **Native App Experience**: Install directly to home screen on any device
- **Offline-First Architecture**: Full functionality even without internet
- **Background Sync**: Automatic data synchronization when connection restored
- **Push Notifications**: Real-time alerts for shift reminders and updates
- **Service Worker**: Advanced caching and performance optimization

### 📊 **Comprehensive Analytics Dashboard**
- **Real-Time Workforce Monitoring**: Live view of active shifts across all locations
- **Advanced Data Visualization**: Interactive charts powered by Chart.js
- **Predictive Analytics**: Workforce pattern analysis and optimization insights
- **Custom Reporting**: Generate detailed reports for compliance and auditing
- **Performance Metrics**: Average hours, productivity trends, and staffing efficiency

### 👩‍⚕️ **Care Worker Experience**
- **One-Tap Clock In/Out**: Streamlined interface optimized for mobile use
- **Smart Location Tracking**: Automatic detection with privacy controls
- **Shift History & Analytics**: Personal performance tracking and insights
- **Optional Notes System**: Add context to clock-ins with rich text notes
- **Notification Preferences**: Customizable alert settings and frequencies

### 👨‍💼 **Manager Command Center**
- **Live Staff Monitoring**: Real-time dashboard showing all active shifts
- **Location Management**: Create and configure multiple work locations
- **Staff Analytics**: Individual and team performance insights
- **Compliance Reporting**: Automated reports for regulatory requirements
- **Workforce Optimization**: Data-driven scheduling recommendations

---

## 🏗️ Technical Architecture

### **System Architecture Diagram**

```mermaid
graph TB
    A[Client Browser/PWA] --> B[Next.js 15 App Router]
    B --> C[Authentication Layer]
    C --> D[Auth0 Provider]
    B --> E[GraphQL API Layer]
    E --> F[Apollo Server]
    F --> G[Prisma ORM]
    G --> H[PostgreSQL Database]
    B --> I[Location Services]
    I --> J[Geolocation API]
    I --> K[Service Worker]
    K --> L[Background Sync]
    B --> M[PWA Components]
    M --> N[Manifest & Icons]
    M --> O[Push Notifications]
```

### **Data Flow Architecture**

```
📱 User Action → 🔐 Auth Check → 📍 Location Verify → 📊 GraphQL API → 💾 Database → 🔄 Real-time Update → 📱 UI Refresh
```

---

## 📁 Complete Project Structure

```
healthcare-shift-tracker/
├── 📁 prisma/
│   ├── schema.prisma                    # Database schema with relations
│   └── migrations/                      # Database migration history
├── 📁 public/
│   ├── manifest.json                    # PWA manifest with shortcuts
│   ├── sw.js                           # Service worker (auto-generated)
│   ├── sw-enhanced.js                  # Custom service worker features
│   └── 📁 icons/                       # PWA icons (72x72 to 512x512)
│       ├── icon-72x72.png
│       ├── icon-96x96.png
│       ├── icon-128x128.png
│       ├── icon-144x144.png
│       ├── icon-152x152.png
│       ├── icon-192x192.png
│       ├── icon-384x384.png
│       └── icon-512x512.png
├── 📁 src/
│   ├── 📁 app/                         # Next.js 15 App Router
│   │   ├── globals.css                 # Global Tailwind styles
│   │   ├── layout.tsx                  # Root layout with PWA meta tags
│   │   ├── page.tsx                    # Landing page with gradient design
│   │   ├── 📁 api/                     # API routes
│   │   │   ├── 📁 auth/
│   │   │   │   └── [...auth0]/route.ts # Auth0 authentication endpoints
│   │   │   └── 📁 graphql/
│   │   │       └── route.ts            # GraphQL API endpoint
│   │   ├── 📁 auth/
│   │   │   └── 📁 signin/
│   │   │       └── page.tsx            # Custom sign-in page
│   │   ├── 📁 care-worker/
│   │   │   └── page.tsx                # Care worker portal with geofencing
│   │   ├── 📁 dashboard/
│   │   │   └── page.tsx                # Analytics dashboard
│   │   ├── 📁 manager/
│   │   │   └── page.tsx                # Manager dashboard with overlay
│   │   └── 📁 tutorial/
│   │       └── page.tsx                # Comprehensive tutorial system
│   ├── 📁 components/                  # React components
│   │   ├── 📁 ui/                      # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── label.tsx
│   │   │   └── alert.tsx
│   │   ├── ClockInOut.tsx              # Clock in/out interface
│   │   ├── StatsCharts.tsx             # Chart.js visualizations
│   │   ├── Providers.tsx               # Context providers wrapper
│   │   ├── GeofencingManager.tsx       # Location tracking component
│   │   └── PWAInstallPrompt.tsx        # PWA installation prompt
│   ├── 📁 contexts/                    # React Context providers
│   │   ├── AppContext.tsx              # Global application state
│   │   └── ToastContext.tsx            # Toast notification system
│   ├── 📁 hooks/                       # Custom React hooks
│   │   └── useGeofencing.ts            # Geofencing functionality hook
│   ├── 📁 lib/                         # Core utilities and configurations
│   │   ├── 📁 graphql/                 # GraphQL implementation
│   │   │   ├── typeDefs.ts             # GraphQL schema definitions
│   │   │   ├── resolvers.ts            # GraphQL resolvers with business logic
│   │   │   ├── queries.ts              # Client-side GraphQL queries
│   │   │   └── mutations.ts            # Client-side GraphQL mutations
│   │   ├── apollo-client.ts            # Apollo Client configuration
│   │   ├── auth0.ts                    # Auth0 configuration
│   │   ├── prisma.ts                   # Prisma client configuration
│   │   ├── utils.ts                    # Utility functions
│   │   ├── locationService.ts          # Advanced location management
│   │   └── sw-utils.ts                 # Service worker utilities
│   └── 📁 middleware.ts                # Next.js middleware for auth
├── 📄 next.config.js                   # Next.js + PWA configuration
├── 📄 tailwind.config.js               # Tailwind CSS configuration
├── 📄 package.json                     # Dependencies and scripts
├── 📄 tsconfig.json                    # TypeScript configuration
├── 📄 .env.local                       # Environment variables
├── 📄 .gitignore                       # Git ignore rules
├── 📄 CLAUDE.md                        # Development documentation
└── 📄 README.md                        # This comprehensive documentation
```

---

## 🛠️ Technology Stack Deep Dive

### **Frontend Technologies**
| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **Next.js** | 15.4.6 | React Framework | App Router, Server Components, PWA support |
| **TypeScript** | 5.0+ | Type Safety | Prevent runtime errors, better DX |
| **Tailwind CSS** | 3.4+ | Styling | Rapid development, consistent design |
| **shadcn/ui** | Latest | UI Components | Modern, accessible, customizable |
| **Lucide React** | Latest | Icons | Beautiful, consistent icon system |

### **Backend & Database**
| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **GraphQL** | 16.8+ | API Layer | Type-safe queries, real-time updates |
| **Apollo Server** | 4.0+ | GraphQL Server | Excellent Next.js integration |
| **Prisma ORM** | 6.13+ | Database Layer | Type-safe database access, migrations |
| **PostgreSQL** | 14+ | Primary Database | Reliable, scalable, JSON support |
| **Auth0** | Latest | Authentication | Enterprise-grade security |

### **PWA & Mobile**
| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **next-pwa** | 5.6+ | PWA Configuration | Automatic service worker generation |
| **Workbox** | Latest | Service Worker | Advanced caching strategies |
| **Web Push API** | Native | Notifications | Real-time user engagement |
| **Geolocation API** | Native | Location Services | Accurate GPS tracking |

### **Data Visualization**
| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **Chart.js** | 4.4+ | Data Visualization | Canvas-based, performant charts |
| **react-chartjs-2** | 5.2+ | React Integration | Seamless React Chart.js wrapper |

---

## 🚀 Advanced Setup & Configuration

### **Prerequisites**
- **Node.js** 18.17+ (LTS recommended)
- **PostgreSQL** 14+ (or compatible cloud database)
- **Auth0 Account** (free tier available)
- **Modern Browser** with PWA support

### **Environment Configuration**

Create a comprehensive `.env.local` file:

```bash
# ==============================================
# Auth0 Configuration (v4.9.0 compatible)
# ==============================================
AUTH0_SECRET="your-32-byte-hex-secret-here"
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://your-domain.auth0.com"
AUTH0_CLIENT_ID="your-auth0-client-id"
AUTH0_CLIENT_SECRET="your-auth0-client-secret"
APP_BASE_URL="http://localhost:3000"

# ==============================================
# Database Configuration
# ==============================================
# PostgreSQL (recommended for production)
DATABASE_URL="postgresql://username:password@localhost:5432/healthshift_db"

# Alternative: Supabase (cloud PostgreSQL)
# DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# Alternative: Railway (cloud PostgreSQL)
# DATABASE_URL="postgresql://postgres:[password]@[host]:5432/railway"

# ==============================================
# Next.js Configuration
# ==============================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-32-byte-hex-secret-here"

# ==============================================
# PWA & Push Notifications (Optional)
# ==============================================
NEXT_PUBLIC_VAPID_PUBLIC_KEY="your-vapid-public-key"
VAPID_PRIVATE_KEY="your-vapid-private-key"

# ==============================================
# Analytics & Monitoring (Optional)
# ==============================================
NEXT_PUBLIC_GA_ID="GA-XXXXXXXXX"
SENTRY_DSN="https://xxx@sentry.io/xxx"
```

### **Detailed Installation Steps**

#### 1. **Project Setup**
```bash
# Clone the repository
git clone https://github.com/your-username/healthcare-shift-tracker.git
cd healthcare-shift-tracker

# Install dependencies with exact versions
npm ci

# Generate Prisma client
npx prisma generate
```

#### 2. **Database Setup**
```bash
# Initialize database (first time only)
npx prisma db push

# Optional: Seed with sample data
npx prisma db seed

# Open Prisma Studio for database management
npx prisma studio
```

#### 3. **Auth0 Configuration**
1. **Create Auth0 Application**:
   - Type: Regular Web Application
   - Technology: Next.js

2. **Configure URLs**:
   ```
   Allowed Callback URLs: http://localhost:3000/api/auth/callback
   Allowed Logout URLs: http://localhost:3000
   Allowed Web Origins: http://localhost:3000
   ```

3. **Social Connections** (Optional):
   - Enable Google OAuth
   - Configure social login settings

#### 4. **Development Server**
```bash
# Start development server with Turbopack
npm run dev

# Alternative: Standard Next.js dev server
npm run dev:standard

# Build for production testing
npm run build
npm run start
```

### **Production Deployment**

#### **Vercel Deployment (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Configure environment variables in Vercel dashboard
```

#### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📱 PWA Installation & Features

### **Installation Instructions**

#### **Mobile Devices**
1. **iOS (Safari)**:
   - Visit the app in Safari
   - Tap the share button (box with arrow)
   - Select "Add to Home Screen"
   - Confirm installation

2. **Android (Chrome/Firefox)**:
   - Visit the app in your browser
   - Look for the "Install" prompt
   - Tap "Install" or use browser menu
   - App will appear on home screen

#### **Desktop Installation**
1. **Chrome/Edge**:
   - Visit the app
   - Look for install icon in address bar
   - Click install and confirm

2. **Manual Installation**:
   - Chrome menu → "Install HealthShift..."
   - App will appear in applications folder

### **PWA Features**
- ✅ **Offline Functionality**: Core features work without internet
- ✅ **Background Sync**: Data syncs when connection restored
- ✅ **Push Notifications**: Real-time alerts and reminders
- ✅ **App Shortcuts**: Quick access to key features
- ✅ **Native App Feel**: Full-screen experience
- ✅ **Auto-Updates**: Latest version automatically downloaded

---

## 🔐 Security & Privacy

### **Security Measures**
- **Authentication**: Auth0 enterprise-grade security
- **Authorization**: Role-based access control (RBAC)
- **Data Encryption**: TLS 1.3 for data in transit
- **Input Validation**: GraphQL schema validation + Prisma types
- **CSRF Protection**: Next.js built-in CSRF protection
- **SQL Injection Prevention**: Prisma ORM prevents SQL injection

### **Privacy Features**
- **Location Data**: Only collected during active shifts
- **Data Retention**: Configurable data retention policies
- **User Consent**: Explicit permission for location services
- **Data Export**: Users can export their personal data
- **GDPR Compliance**: Built-in privacy controls

---

## 📊 Analytics & Reporting

### **Manager Dashboard Metrics**
- 📈 **Real-Time Active Shifts**: Live workforce monitoring
- ⏱️ **Average Daily Hours**: Team productivity metrics
- 📅 **Daily Clock-In Trends**: Staffing pattern analysis
- 👥 **Weekly Staff Hours**: Individual performance tracking
- 🍩 **Hour Distribution**: Full-time vs part-time analysis
- 📋 **Comprehensive Shift History**: Complete audit trail

### **Care Worker Analytics**
- ⏰ **Personal Shift History**: Individual performance tracking
- 📊 **Monthly Hours Summary**: Personal productivity insights
- 🎯 **Average Shift Duration**: Consistency metrics
- 📍 **Location Analytics**: Work pattern insights

---

## 🎯 Business Impact & ROI

### **For Healthcare Organizations**
- **💰 Cost Savings**: Eliminate time theft and buddy punching
- **📋 Compliance**: Automated reporting for regulatory requirements
- **📈 Productivity**: Data-driven workforce optimization
- **⚡ Efficiency**: Streamlined shift management processes
- **🔍 Visibility**: Real-time workforce insights

### **For Care Workers**
- **📱 Convenience**: Mobile-first design for easy use
- **🔒 Transparency**: Clear shift history and performance data
- **⚡ Speed**: One-tap clock in/out functionality
- **🎯 Accuracy**: GPS verification prevents disputes

### **For Managers**
- **📊 Insights**: Comprehensive workforce analytics
- **⏰ Real-Time**: Instant visibility into staffing levels
- **📈 Optimization**: Data-driven scheduling decisions
- **📋 Reporting**: Automated compliance reports

---

## 🧪 Testing & Quality Assurance

### **Automated Testing**
- **Unit Tests**: Core business logic testing
- **Integration Tests**: API and database testing
- **E2E Tests**: Complete user workflow testing
- **PWA Tests**: Service worker and offline functionality

### **Manual Testing Checklist**
- ✅ Authentication flows (login/logout)
- ✅ Location-based clock in/out
- ✅ Manager dashboard functionality
- ✅ PWA installation and offline mode
- ✅ Cross-device compatibility
- ✅ Performance optimization

---

## 🚀 Performance Optimizations

### **Frontend Performance**
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js automatic image optimization
- **Lazy Loading**: Components loaded on demand
- **Caching**: Aggressive caching strategies
- **Bundle Analysis**: Optimized bundle sizes

### **Backend Performance**
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connections
- **GraphQL Optimization**: Query optimization and caching
- **CDN Integration**: Static asset delivery optimization

---

## 🔮 Future Enhancements & Roadmap

### **Phase 2: Advanced Features**
- 🔔 **Smart Notifications**: AI-powered shift reminders
- 📅 **Shift Scheduling**: Advanced scheduling system
- 📊 **Predictive Analytics**: Machine learning insights
- 🏥 **Multi-Facility Support**: Enterprise-scale deployment
- 💬 **Communication Hub**: In-app messaging system

### **Phase 3: Enterprise Features**
- 📈 **Advanced Reporting**: Custom report builder
- 🔄 **API Integration**: Third-party system integration
- 👥 **Team Management**: Advanced user management
- 🎯 **Performance Metrics**: KPI tracking and goals
- 🔐 **SSO Integration**: Enterprise authentication

---

## 📚 Documentation & Support

### **Developer Resources**
- 📖 **API Documentation**: Complete GraphQL schema reference
- 🎥 **Video Tutorials**: Step-by-step implementation guides
- 💡 **Best Practices**: Code quality and security guidelines
- 🔧 **Troubleshooting**: Common issues and solutions

### **User Guides**
- 👩‍⚕️ **Care Worker Guide**: Complete user manual
- 👨‍💼 **Manager Guide**: Administrative features walkthrough
- 📱 **Mobile Guide**: PWA installation and usage
- ❓ **FAQ**: Frequently asked questions

---

## 🤝 Contributing & Development

### **Development Workflow**
1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Create** Pull Request

### **Code Standards**
- **ESLint**: Consistent code style
- **Prettier**: Automatic code formatting
- **TypeScript**: Strict type checking
- **Conventional Commits**: Standardized commit messages

---

## 📄 License & Legal

This project is developed as a comprehensive solution for healthcare workforce management, implementing industry best practices for security, performance, and user experience.

**Built with ❤️ for healthcare organizations and workers worldwide**

---

## 📞 Support & Contact

For technical support, feature requests, or general inquiries:

- 📧 **Email**: support@healthshift.app
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/your-username/healthcare-shift-tracker/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/your-username/healthcare-shift-tracker/discussions)
- 📚 **Documentation**: [Wiki](https://github.com/your-username/healthcare-shift-tracker/wiki)

---

<div align="center">

**HealthShift** - Revolutionizing Healthcare Workforce Management

[![Live Demo](https://img.shields.io/badge/🚀-Live%20Demo-blue?style=for-the-badge)](https://lief-assignment-xq7a.vercel.app/)
[![Tutorial](https://img.shields.io/badge/📖-Tutorial-green?style=for-the-badge)](https://lief-assignment-xq7a.vercel.app/tutorial)

</div>