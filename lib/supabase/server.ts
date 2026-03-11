import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const cookieStore = await cookies()

  // production requires credentials so that real clients can be created.
  if (
    process.env.NODE_ENV === 'production' &&
    (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  ) {
    throw new Error(
      'Supabase URL/key are not set. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )
  }

  // support development without any Supabase configuration
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
        if (
          ['select', 'eq', 'order', 'single', 'update', 'insert', 'limit',
           'lte', 'gte', 'in', 'match', 'ilike', 'neq', 'set'].includes(
            prop as string,
          )
        ) {
          return () => proxy
        }
        return () => noopResponse
      },
    }
    const proxy = new Proxy({}, handler)
    return proxy as any
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // The "setAll" method was called from a Server Component.
            // This can be ignored if you have proxy refreshing
            // user sessions.
          }
        },
      },
    },
  )
}
