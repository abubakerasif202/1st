import type { CustomerApplicationValues } from './schema'

export const APPLICATION_INFRA_MESSAGE =
  'We’re temporarily unable to submit your application. Your information has not been lost from this form. Please try again shortly.'

export type ApplicationErrorKind = 'validation' | 'infrastructure' | 'unknown'

export class ApplicationApiError extends Error {
  readonly kind: ApplicationErrorKind
  readonly fieldErrors?: Record<string, string[]>
  constructor(kind: ApplicationErrorKind, message: string, fieldErrors?: Record<string, string[]>) {
    super(message)
    this.name = 'ApplicationApiError'
    this.kind = kind
    this.fieldErrors = fieldErrors
  }
}

export interface ApplicationResult {
  applicationReference: string
  status: string
}

export async function submitCustomerApplication(args: {
  form: CustomerApplicationValues
  idempotencyKey: string
  termsVersion: string
}): Promise<ApplicationResult> {
  let response: Response
  try {
    response = await fetch('/api/customer-applications', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...args, website: '' }),
    })
  } catch {
    throw new ApplicationApiError('infrastructure', APPLICATION_INFRA_MESSAGE)
  }

  if (response.ok) return (await response.json()) as ApplicationResult

  let body: { message?: string; error?: string; fieldErrors?: Record<string, string[]> } = {}
  try {
    body = await response.json()
  } catch {
    /* non-JSON */
  }
  if (response.status === 400 || response.status === 422) {
    throw new ApplicationApiError('validation', body.message || 'Some details need attention.', body.fieldErrors)
  }
  if (response.status >= 500) {
    throw new ApplicationApiError('infrastructure', APPLICATION_INFRA_MESSAGE)
  }
  throw new ApplicationApiError('unknown', body.message || 'Something went wrong. Please try again.')
}
