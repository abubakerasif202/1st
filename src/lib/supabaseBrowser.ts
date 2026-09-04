// Browser Supabase client — used only for the admin console sign-in. Anon key
// only; never the service role. Returns null when the environment is not
// configured so the admin guard can show a clear "not set up" message instead
// of throwing.

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null | undefined

export function supabaseBrowser(): SupabaseClient | null {
  if (client !== undefined) return client
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  client = url && anonKey ? createClient(url, anonKey) : null
  return client
}

export const isAdminConfigured = (): boolean => supabaseBrowser() !== null
