// Admin authorisation for the /api/admin/* routes.
//
// Two independent checks must both pass:
//  1. a valid Supabase session (JWT verified by Supabase via getUser)
//  2. that user's email is on the ADMIN_EMAILS allowlist
//
// There is no bypass — no shared password, no secret path, no query-string
// token. The database also carries an is_admin() RLS policy as a second layer.

import type { VercelRequest } from '@vercel/node'
import { env } from './env'
import { HttpError } from './http'
import { userClient } from './supabaseAdmin'

export interface AdminIdentity {
  userId: string
  email: string
}

function bearerToken(req: VercelRequest): string {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    throw new HttpError(401, 'Sign in as an administrator to continue.')
  }
  return header.slice('Bearer '.length).trim()
}

export async function requireAdmin(req: VercelRequest): Promise<AdminIdentity> {
  const token = bearerToken(req)
  const allowlist = env.adminEmails()
  if (allowlist.length === 0) {
    throw new HttpError(503, 'Admin access is not configured.')
  }

  const { data, error } = await userClient(token).auth.getUser(token)
  if (error || !data.user?.email) {
    throw new HttpError(401, 'Your session has expired. Sign in again.')
  }

  const email = data.user.email.toLowerCase()
  if (!allowlist.includes(email)) {
    throw new HttpError(403, 'This account is not authorised for the admin console.')
  }

  return { userId: data.user.id, email }
}
