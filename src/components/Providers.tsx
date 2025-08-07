'use client'

import { SessionProvider } from 'next-auth/react'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from '@/lib/apollo-client'
import { AppProvider } from '@/contexts/AppContext'
import { ToastProvider } from '@/contexts/ToastContext'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ApolloProvider client={apolloClient}>
        <AppProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AppProvider>
      </ApolloProvider>
    </SessionProvider>
  )
}