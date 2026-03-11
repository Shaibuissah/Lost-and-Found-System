import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // if the project isn’t configured with Supabase credentials, return a
  // lightweight stub that won’t crash when pages call its methods. This lets
  // the app render locally without any network activity or errors.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
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
