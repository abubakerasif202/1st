// Config access for the serverless functions.
//
// Every getter reads process.env lazily and throws a clear error only when the
// value is actually needed. Nothing is read at module load, so `npm run build`
// and the unit tests (which never call these) work without any secrets present.

function required(name: string): string {
  const value = process.env[name]
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value.trim()
}

function optional(name: string): string | undefined {
  const value = process.env[name]
  return value && value.trim() !== '' ? value.trim() : undefined
}

export const env = {
  supabaseUrl: () => required('SUPABASE_URL'),
  supabaseServiceRoleKey: () => required('SUPABASE_SERVICE_ROLE_KEY'),
  supabaseAnonKey: () => required('SUPABASE_ANON_KEY'),

  resendApiKey: () => optional('RESEND_API_KEY'),
  quoteFromEmail: () => optional('QUOTE_FROM_EMAIL'),
  quoteInternalEmail: () => optional('QUOTE_INTERNAL_EMAIL'),

  freightTermsVersion: () => optional('FREIGHT_TERMS_VERSION') ?? '2026-09-01',
  adminEmails: () =>
    (optional('ADMIN_EMAILS') ?? '')
      .split(',')
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean),

  siteUrl: () => optional('VITE_SITE_URL') ?? 'https://www.1stclassexpress.com.au',
  isProduction: () => process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production',
}
