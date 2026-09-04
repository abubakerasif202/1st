import { useState, type ReactNode } from 'react'
import { useAdminAuth } from './adminAuthContext.js'

/**
 * Gates the admin console. Shows the sign-in form until there is a session; the
 * server still re-checks the ADMIN_EMAILS allowlist on every API call, so a
 * signed-in non-admin sees empty data and 403s, never the console.
 */
export function AdminGuard({ children }: { children: ReactNode }) {
  const { configured, loading, session, email, signOut } = useAdminAuth()

  if (!configured) {
    return (
      <div className="fq-respond">
        <h1>Admin console</h1>
        <p className="fq-banner fq-banner--error" role="alert">
          The admin console is not configured for this environment
          (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are missing).
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="fq-respond">
        <p role="status">Checking your session…</p>
      </div>
    )
  }

  if (!session) return <AdminLogin />

  return (
    <div className="fq-admin">
      <div className="fq-admin__bar">
        <span>
          Signed in as <strong>{email}</strong>
        </span>
        <button type="button" className="fq-btn fq-btn--link" onClick={signOut}>
          Sign out
        </button>
      </div>
      {children}
    </div>
  )
}

function AdminLogin() {
  const { signIn } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setError(null)
    const { error: signInError } = await signIn(email.trim(), password)
    setBusy(false)
    if (signInError) setError(signInError)
  }

  return (
    <form className="fq-respond" onSubmit={onSubmit}>
      <h1>Admin sign in</h1>
      {error && (
        <p className="fq-banner fq-banner--error" role="alert">
          {error}
        </p>
      )}
      <div className="fq-field">
        <label htmlFor="admin-email" className="fq-field__label">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          className="fq-field__control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="fq-field">
        <label htmlFor="admin-password" className="fq-field__label">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          className="fq-field__control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="fq-btn fq-btn--primary" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
