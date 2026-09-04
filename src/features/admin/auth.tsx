// Admin authentication provider. There is no client-side "isAdmin" flag — every
// admin API call is authorised on the server against the ADMIN_EMAILS allowlist.

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabaseBrowser } from '../../lib/supabaseBrowser.js'
import { AdminAuthContext, type AdminAuthValue } from './adminAuthContext.js'


export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const client = supabaseBrowser()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState<boolean>(!!client)

  useEffect(() => {
    if (!client) return
    let active = true
    client.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session)
        setLoading(false)
      }
    })
    const { data: sub } = client.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [client])

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!client) return { error: 'Admin sign-in is not configured.' }
      const { error } = await client.auth.signInWithPassword({ email, password })
      return { error: error ? error.message : null }
    },
    [client],
  )

  const signOut = useCallback(async () => {
    await client?.auth.signOut()
    setSession(null)
  }, [client])

  const value = useMemo<AdminAuthValue>(
    () => ({
      configured: !!client,
      loading,
      session,
      email: session?.user?.email ?? null,
      accessToken: session?.access_token ?? null,
      signIn,
      signOut,
    }),
    [client, loading, session, signIn, signOut],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}
