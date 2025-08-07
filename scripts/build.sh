#!/bin/bash

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Build the Next.js application
echo "🏗️ Building Next.js application..."
npx next build

echo "✅ Build completed successfully!"