import { createClient as createBrowserClient } from '@supabase/supabase-js'

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

  // during development we provide a fake auth stub so the UI behaves like
  // a real backend even if you haven't configured SUPABASE env vars. This
  // way the sign-in/sign-up flows will actually navigate instead of bouncing
  // back to the login page.
  if (
    process.env.NODE_ENV !== 'production' &&
    (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  ) {
    const noopResponse = Promise.resolve({ data: null, error: null })
    let fakeUser: any = null

    const handler: ProxyHandler<any> = {
      get(_target, prop) {
        if (prop === 'from') {
          return () => proxy
        }
        if (prop === 'auth') {
          return {
            getUser: async () => ({ data: { user: fakeUser }, error: null }),
            signInWithPassword: async ({ email }: any) => {
              fakeUser = { id: 'dev-user', email, user_metadata: {} }
              return { data: { user: fakeUser }, error: null }
            },
            signUp: async ({ email }: any) => {
              fakeUser = { id: 'dev-user', email, user_metadata: {} }
              return { data: { user: fakeUser }, error: null }
            },
            signInWithOtp: async () => noopResponse,
            updateUser: async () => noopResponse,
            signOut: async () => {
              fakeUser = null
              return { error: null }
            },
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
