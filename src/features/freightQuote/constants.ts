// The terms version the wizard presents. The server records its own
// `FREIGHT_TERMS_VERSION` against the stored quote — the client value is
// informational and must match for a submission to be accepted.
export const FREIGHT_TERMS_VERSION =
  (import.meta.env.VITE_FREIGHT_TERMS_VERSION as string | undefined)?.trim() || '2026-09-01'
