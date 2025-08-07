'use client'

import { Auth0Provider } from '@auth0/nextjs-auth0'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from '@/lib/apollo-client'
import { AppProvider } from '@/contexts/AppContext'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Auth0Provider>
      <ApolloProvider client={apolloClient}>
        <AppProvider>
          {children}
        </AppProvider>
      </ApolloProvider>
    </Auth0Provider>
  )
}