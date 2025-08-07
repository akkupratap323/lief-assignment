import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client();

// Re-export Auth0Provider for client components
export { Auth0Provider } from '@auth0/nextjs-auth0';