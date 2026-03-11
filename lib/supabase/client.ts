import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // production deployments *must* have valid SUPABASE env vars. If they are
  // missing in production, fail fast so the deploy will error instead of
  // appearing to work with a stubbed client.
  if (
    process.env.NODE_ENV === 'production' &&
    (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  ) {
    throw new Error(
      'Supabase URL/key are not set. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )
  }

  // during development we provide a no-op stub so the UI renders even without
  // a real backend. This avoids breaking the site when env vars are absent.
  if (
    process.env.NODE_ENV !== 'production' &&
    (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  ) {
    const noopResponse = Promise.resolve({ data: null, error: null })
    const handler: ProxyHandler<any> = {
      get(_target, prop) {
        if (prop === 'from') {
          return () => proxy
        }
        if (prop === 'auth') {
          return {
            getUser: async () => ({ data: { user: null }, error: null }),
            signInWithOtp: async () => noopResponse,
            signUp: async () => noopResponse,
            updateUser: async () => noopResponse,
            signOut: async () => ({ error: null }),
            onAuthStateChange: () => ({
              data: { subscription: { unsubscribe: () => {} } },
            }),
          }
        }
        // query builder methods that should chain
        if (
          ['select', 'eq', 'order', 'single', 'update', 'insert', 'limit',
           'lte', 'gte', 'in', 'match', 'ilike', 'neq', 'set'].includes(
            prop as string,
          )
        ) {
          return () => proxy
        }
        // default: return a function that resolves to an empty result
        return () => noopResponse
      },
    }
    const proxy = new Proxy({}, handler)
    return proxy as any
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
