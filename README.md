# Healthcare Shift Tracker

A modern web application for healthcare organizations to manage their workforce shifts with location-based clock in/out functionality, built with Next.js, GraphQL, and Auth0.

![Healthcare Shift Tracker](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

## 🏥 Overview

This application enables healthcare organizations to efficiently track their staff's work hours through location-verified clock in/out functionality. The system ensures staff can only clock in when they are within the designated perimeter of their workplace, providing accurate time tracking and location verification.

## ✨ Features Implemented

### 🔐 Authentication & User Management
- **Auth0 Integration**: Secure authentication with Google and email login options
- **Role-based Access Control**: Separate interfaces for managers and care workers
- **User Registration**: Automatic user creation on first login

### 👩‍⚕️ Care Worker Features
- **Location-based Clock In/Out**: GPS verification within configurable perimeters
- **Real-time Location Detection**: Automatic location tracking with permission handling
- **Optional Shift Notes**: Add notes when clocking in or out
- **Current Shift Status**: View active shift details and duration
- **Shift History**: Personal shift tracking and history

### 👨‍💼 Manager Features
- **Live Staff Monitoring**: View all currently active shifts in real-time
- **Comprehensive Dashboard**: Analytics and insights into workforce patterns
- **Staff Management**: View complete shift history for all staff members
- **Location Perimeter Setting**: Configure allowed areas for clock in/out (2km radius by default)

### 📊 Analytics & Reporting
- **Average Hours per Day**: Calculated across all staff
- **Daily Clock-in Statistics**: Number of people clocking in each day
- **Weekly Hours by Staff**: Individual staff hour tracking over the past week
- **Visual Charts**: Bar charts and doughnut charts for data visualization
- **Staff Distribution Analysis**: Breakdown by hour categories (full-time, part-time, minimal)

### 🔧 Technical Features
- **Progressive Web App (PWA)**: Installable on mobile devices with offline capabilities
- **Responsive Design**: Mobile-first design that works on all device sizes
- **Real-time Updates**: GraphQL subscriptions for live data updates
- **Location Services**: HTML5 Geolocation API with error handling
- **Distance Calculation**: Accurate distance calculation using Haversine formula

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Lucide React** - Beautiful icons

### Backend
- **GraphQL** - API query language with Apollo Server
- **Prisma ORM** - Database toolkit and query builder
- **PostgreSQL** - Primary database (configurable)
- **Auth0** - Authentication and authorization service

### Data Visualization
- **Chart.js** - Canvas-based charts
- **react-chartjs-2** - React wrapper for Chart.js

### PWA & Mobile
- **next-pwa** - Service worker and PWA configuration
- **Web App Manifest** - Native app-like experience

### State Management
- **React Context** - Global state management
- **Apollo Client** - GraphQL client with caching

## 📁 Project Structure

```
healthcare-shift-tracker/
├── prisma/
│   └── schema.prisma              # Database schema
├── public/
│   ├── manifest.json              # PWA manifest
│   └── icons/                     # PWA icons
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...auth0]/   # Auth0 API routes
│   │   │   └── graphql/           # GraphQL API endpoint
│   │   ├── dashboard/             # Manager dashboard
│   │   ├── layout.tsx             # Root layout with providers
│   │   └── page.tsx               # Home page
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── ClockInOut.tsx         # Care worker interface
│   │   └── StatsCharts.tsx        # Data visualization
│   ├── contexts/
│   │   └── AppContext.tsx         # Global state management
│   └── lib/
│       ├── graphql/
│       │   ├── typeDefs.ts        # GraphQL schema
│       │   ├── resolvers.ts       # GraphQL resolvers
│       │   ├── queries.ts         # GraphQL queries
│       │   └── mutations.ts       # GraphQL mutations
│       ├── apollo-client.ts       # Apollo Client setup
│       ├── auth0.ts               # Auth0 configuration
│       └── prisma.ts              # Prisma client
└── next.config.js                 # Next.js + PWA configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Auth0 account

### Environment Variables
Create a `.env.local` file:

```env
# Auth0 Configuration
AUTH0_SECRET='your-secret-key-here'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-auth0-domain.auth0.com'
AUTH0_CLIENT_ID='your-auth0-client-id'
AUTH0_CLIENT_SECRET='your-auth0-client-secret'

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/healthcare_shift_tracker"

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### Installation & Setup

1. **Clone and install dependencies:**
```bash
git clone https://github.com/akkupratap323/lief-assignment.git
cd lief-assignment
npm install
```

2. **Set up the database:**
```bash
npx prisma generate
npx prisma db push
```

3. **Configure Auth0:**
   - Create an Auth0 application
   - Set allowed callback URLs: `http://localhost:3000/api/auth/callback`
   - Set allowed logout URLs: `http://localhost:3000`
   - Enable Google social connection (optional)

4. **Run the development server:**
```bash
npm run dev
```

5. **Access the application:**
   - Open http://localhost:3000
   - Sign in with Auth0
   - Create an organization (managers only)
   - Start tracking shifts!

## 📱 PWA Installation

The app can be installed on mobile devices:

1. **iOS Safari:**
   - Tap the share button
   - Select "Add to Home Screen"

2. **Android Chrome:**
   - Tap the menu (three dots)
   - Select "Add to Home screen"

3. **Desktop Chrome:**
   - Click the install icon in the address bar
   - Or use Chrome menu → "Install Healthcare Shift Tracker"

## 🏗️ Database Schema

### User Model
- Authentication via Auth0
- Role-based access (MANAGER/CARE_WORKER)
- Personal information and timestamps

### Organization Model
- Location coordinates (latitude/longitude)
- Configurable radius for perimeter checking
- Address and descriptive information

### Shift Model
- Clock in/out timestamps with location data
- Optional notes for both clock in and clock out
- Calculated total hours
- Relationship to user and organization

## 🔐 Security Features

- **Auth0 Integration**: Industry-standard authentication
- **Location Verification**: GPS-based perimeter checking
- **Role-based Access**: Managers and care workers have different permissions
- **Input Validation**: GraphQL schema validation and Prisma type safety
- **HTTPS Ready**: Secure communication in production

## 📊 Analytics Capabilities

### Manager Dashboard Metrics:
- **Real-time Active Shifts**: Live view of who's currently working
- **Average Daily Hours**: Calculated across all staff
- **Daily Clock-ins**: Count of shifts started each day
- **Weekly Staff Hours**: Individual hour tracking over 7 days
- **Hour Distribution**: Visual breakdown of full-time vs part-time staff
- **Shift History**: Complete audit trail of all shifts

## 🎯 Business Value

### For Healthcare Organizations:
- **Accurate Time Tracking**: Location-verified clock in/out eliminates time theft
- **Compliance**: Detailed shift records for regulatory requirements
- **Workforce Insights**: Data-driven decisions about staffing patterns
- **Mobile-first**: Works on any device, perfect for healthcare environments

### For Care Workers:
- **Simple Interface**: Easy clock in/out with optional notes
- **Transparency**: View personal shift history and current status
- **Mobile Optimized**: Quick access from smartphones

### For Managers:
- **Real-time Visibility**: Know who's working at any moment
- **Analytics**: Understand workforce patterns and optimize scheduling
- **Audit Trail**: Complete history of all shift activities

## 🌟 Future Enhancements

### Bonus Features (Potential Additions):
- **Automatic Notifications**: Alert workers when entering/leaving perimeter
- **Shift Scheduling**: Pre-planned shifts with notifications
- **Break Tracking**: Sub-shift break management
- **Overtime Alerts**: Automatic overtime detection and notifications
- **Multi-location Support**: Support for multiple healthcare facilities
- **Advanced Analytics**: Predictive scheduling and pattern analysis

## 🧪 Testing

The application includes comprehensive error handling:
- Location permission errors
- Network connectivity issues
- Auth0 authentication failures
- Database connection problems
- GraphQL query/mutation errors

## 📱 Mobile Experience

- **Responsive Design**: Optimized for mobile screens
- **Touch-friendly**: Large buttons and intuitive gestures
- **PWA Capabilities**: Install as native app
- **Offline Support**: Basic functionality when disconnected
- **Location Services**: Seamless GPS integration

## 🔧 Development

### Available Scripts:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Database GUI
- `npx prisma generate` - Generate Prisma client

### GraphQL Playground:
Access the GraphQL playground at http://localhost:3000/api/graphql

## 📄 License

This project is developed for Lief's technical assessment and follows industry best practices for healthcare workforce management applications.

## 🤝 Contributing

This project was built as a comprehensive solution for healthcare shift tracking, implementing all required features plus additional enhancements for production readiness.

---

**Built with ❤️ for healthcare workers and organizations**
