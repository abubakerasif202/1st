import { createContext, useContext } from 'react'
import type { Session } from '@supabase/supabase-js'

export interface AdminAuthValue {
  configured: boolean
  loading: boolean
  session: Session | null
  email: string | null
  accessToken: string | null
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

export const AdminAuthContext = createContext<AdminAuthValue | null>(null)

export function useAdminAuth(): AdminAuthValue {
  const context = useContext(AdminAuthContext)
  if (!context) throw new Error('useAdminAuth must be used inside <AdminAuthProvider>')
  return context
}
