// Lazily-constructed Supabase clients for the serverless functions.
//
//  * `adminClient()` uses the service-role key and bypasses RLS. It is only ever
//    used server-side and the key must never reach the browser bundle.
//  * `userClient(accessToken)` acts as the signed-in user, so RLS + the
//    `is_admin()` allowlist policy still apply. Used to authorise admin reads.

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env } from './env'

let admin: SupabaseClient | null = null

export function adminClient(): SupabaseClient {
  if (!admin) {
    admin = createClient(env.supabaseUrl(), env.supabaseServiceRoleKey(), {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return admin
}

export function userClient(accessToken: string): SupabaseClient {
  return createClient(env.supabaseUrl(), env.supabaseAnonKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  })
}
