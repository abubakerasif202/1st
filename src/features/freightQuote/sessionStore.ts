// Session-scoped helpers. Two uses:
//  * remember the opaque view-token for a submitted quote so a refresh of the
//    confirmation page can re-fetch it
//  * keep an in-progress wizard draft across an accidental reload
//
// This is a UX convenience only. It is sessionStorage (cleared when the tab
// closes) and it is never treated as the system of record — the server is.

const TOKEN_PREFIX = 'fce:quote-token:'
const DRAFT_KEY = 'fce:quote-draft'

function safeGet(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value)
  } catch {
    // storage disabled / full — the feature just degrades
  }
}

function safeRemove(key: string): void {
  try {
    window.sessionStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

export function rememberQuoteToken(reference: string, token: string): void {
  safeSet(`${TOKEN_PREFIX}${reference}`, token)
}

export function recallQuoteToken(reference: string): string | null {
  return safeGet(`${TOKEN_PREFIX}${reference}`)
}

export function rememberDraft(values: unknown): void {
  safeSet(DRAFT_KEY, JSON.stringify(values))
}

export function recallDraft<T>(): T | null {
  const raw = safeGet(DRAFT_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function clearDraft(): void {
  safeRemove(DRAFT_KEY)
}
