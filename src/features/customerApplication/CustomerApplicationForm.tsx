import { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { FREIGHT_TERMS_VERSION } from '../freightQuote/constants'
import {
  CheckboxField,
  CheckboxGroup,
  RadioGroup,
  SelectField,
  TextAreaField,
  TextField,
} from '../freightQuote/fields'
import { STATE_OPTIONS, PAYMENT_METHOD_OPTIONS, PAYMENT_TERMS_OPTIONS } from '../freightQuote/options'
import {
  APPLICATION_INFRA_MESSAGE,
  ApplicationApiError,
  submitCustomerApplication,
} from './api'
import {
  customerApplicationSchema,
  emptyCustomerApplication,
  type CustomerApplicationValues,
} from './schema'

type Banner = { kind: 'error'; message: string } | null

export function CustomerApplicationForm() {
  const [banner, setBanner] = useState<Banner>(null)
  const [done, setDone] = useState<{ reference: string } | null>(null)
  // Lazy initialiser: one stable key for the whole submission session. useState's
  // initialiser is the sanctioned place for this kind of one-off value.
  const [idempotencyKey] = useState<string>(() =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `fce-app-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  )

  const methods = useForm<CustomerApplicationValues>({
    resolver: zodResolver(customerApplicationSchema),
    mode: 'onBlur',
    defaultValues: emptyCustomerApplication(),
  })
  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = methods

  const onValid = useCallback(async (form: CustomerApplicationValues) => {
    setBanner(null)
    try {
      const result = await submitCustomerApplication({
        form,
        idempotencyKey,
        termsVersion: FREIGHT_TERMS_VERSION,
      })
      setDone({ reference: result.applicationReference })
    } catch (error) {
      if (error instanceof ApplicationApiError && error.kind === 'validation' && error.fieldErrors) {
        for (const [path, messages] of Object.entries(error.fieldErrors)) {
          setError(path as keyof CustomerApplicationValues, { type: 'server', message: messages[0] })
        }
        setBanner({ kind: 'error', message: 'Some details need attention — see the highlighted fields.' })
        return
      }
      setBanner({
        kind: 'error',
        message:
          error instanceof ApplicationApiError && error.kind === 'infrastructure'
            ? APPLICATION_INFRA_MESSAGE
            : error instanceof Error
              ? error.message
              : 'Something went wrong. Please try again.',
      })
    }
  }, [setError, idempotencyKey])

  if (done) {
    return (
      <div className="fq-confirm">
        <header className="fq-confirm__head">
          <p className="fq-confirm__eyebrow">Application received</p>
          <h1 className="fq-confirm__ref">{done.reference}</h1>
          <p className="fq-confirm__meta">
            Status: <strong>Pending Review</strong>. Requested payment terms are a
            request only — an account is not open until 1st Class Express confirms it
            in writing.
          </p>
        </header>
        <Link className="fq-btn fq-btn--ghost" to="/">
          Back to home
        </Link>
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <form className="fq-wizard" noValidate onSubmit={handleSubmit(onValid)}>
        {banner && (
          <p className="fq-banner fq-banner--error" role="alert">
            {banner.message}
          </p>
        )}

        <fieldset className="fq-wizard__panel">
          <legend className="fq-wizard__heading">Business details</legend>
          <div className="fq-step-grid">
            <TextField name="legalBusinessName" label="Legal business name" required className="fq-span-2" autoComplete="organization" />
            <TextField name="tradingName" label="Trading name" />
            <div className="fq-spacer" aria-hidden="true" />
            <TextField name="abn" label="ABN" required inputMode="numeric" hint="11 digits" />
            <TextField name="acn" label="ACN" inputMode="numeric" hint="9 digits, if applicable" />
          </div>
        </fieldset>

        <fieldset className="fq-wizard__panel">
          <legend className="fq-wizard__heading">Business address</legend>
          <div className="fq-step-grid">
            <TextField name="businessAddress" label="Street address" required className="fq-span-2" autoComplete="street-address" />
            <TextField name="suburb" label="Suburb" required autoComplete="address-level2" />
            <SelectField name="state" label="State" required options={STATE_OPTIONS} placeholder="Select a state" />
            <TextField name="postcode" label="Postcode" required inputMode="numeric" autoComplete="postal-code" />
          </div>
        </fieldset>

        <fieldset className="fq-wizard__panel">
          <legend className="fq-wizard__heading">Primary contact</legend>
          <div className="fq-step-grid">
            <TextField name="primaryContactName" label="Name" required autoComplete="name" />
            <TextField name="primaryContactPosition" label="Position" />
            <TextField name="primaryContactEmail" label="Email" required type="email" autoComplete="email" />
            <TextField name="primaryContactPhone" label="Phone" required type="tel" autoComplete="tel" />
          </div>
        </fieldset>

        <fieldset className="fq-wizard__panel">
          <legend className="fq-wizard__heading">Accounts contact</legend>
          <p className="fq-wizard__blurb">For invoicing and statements, if different from the primary contact.</p>
          <div className="fq-step-grid">
            <TextField name="accountsContactName" label="Name" required={false} />
            <TextField name="accountsContactEmail" label="Email" required={false} type="email" />
            <TextField name="accountsContactPhone" label="Phone" required={false} type="tel" />
          </div>
        </fieldset>

        <fieldset className="fq-wizard__panel">
          <legend className="fq-wizard__heading">Operating hours &amp; cutoffs</legend>
          <div className="fq-step-grid">
            <TextField name="operatingOpenTime" label="Opens" required={false} type="time" />
            <TextField name="operatingCloseTime" label="Closes" required={false} type="time" />
            <TextField name="saturdayHours" label="Saturday hours" required={false} placeholder="e.g. 8:00–12:00 or Closed" />
            <TextField name="sundayHours" label="Sunday hours" required={false} placeholder="e.g. Closed" />
            <TextField name="pickupCutoffTime" label="Pickup cutoff" required={false} type="time" />
            <TextField name="deliveryCutoffTime" label="Delivery cutoff" required={false} type="time" />
          </div>
        </fieldset>

        <fieldset className="fq-wizard__panel">
          <legend className="fq-wizard__heading">Site information</legend>
          <CheckboxGroup legend="Site handling">
            <CheckboxField name="siteForkliftAvailable" label="Forklift available on site" />
            <CheckboxField name="siteLoadingDockAvailable" label="Loading dock available" />
            <CheckboxField name="siteTailgateRequired" label="Tailgate vehicle usually required" />
          </CheckboxGroup>
          <TextAreaField name="siteSpecialInstructions" label="Special instructions" required={false} className="fq-span-2" />
        </fieldset>

        <fieldset className="fq-wizard__panel">
          <legend className="fq-wizard__heading">Payment terms request</legend>
          <p className="fq-wizard__blurb">
            These are <strong>requested</strong> only. Credit is not granted until 1st
            Class Express approves the account in writing.
          </p>
          <RadioGroup name="paymentMethodRequested" legend="Preferred payment method" required options={[...PAYMENT_METHOD_OPTIONS]} />
          <RadioGroup name="paymentTermsRequested" legend="Requested payment terms" required options={[...PAYMENT_TERMS_OPTIONS]} />
        </fieldset>

        <fieldset className="fq-wizard__panel">
          <legend className="fq-wizard__heading">Authorised signatory</legend>
          <div className="fq-step-grid">
            <TextField name="authorisedSignatoryName" label="Full name" required autoComplete="name" />
            <TextField name="authorisedSignatoryPosition" label="Position" required />
            <TextField name="authorisedSignatoryEmail" label="Email" required type="email" />
            <TextField name="authorisedSignatoryPhone" label="Phone" required type="tel" />
            <TextField name="typedSignature" label="Type your full name as signature" required hint="Must match the signatory name above" />
            <TextField name="signatureDate" label="Date" required type="date" />
          </div>
        </fieldset>

        <fieldset className="fq-wizard__panel">
          <legend className="fq-wizard__heading">Terms acceptance</legend>
          <label htmlFor="termsAccepted" className="fq-check">
            <input id="termsAccepted" type="checkbox" className="fq-check__box" {...methods.register('termsAccepted')} />
            <span>
              I am authorised to submit this application and I have read and agree to the{' '}
              <Link to="/freight-terms" target="_blank" rel="noopener noreferrer">
                Freight Terms &amp; Conditions
              </Link>
              .
            </span>
          </label>
          {methods.formState.errors.termsAccepted && (
            <small className="fq-field__error" role="alert">
              {methods.formState.errors.termsAccepted.message as string}
            </small>
          )}
        </fieldset>

        <div className="fq-wizard__nav">
          <span />
          <button type="submit" className="fq-btn fq-btn--primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting…' : 'Submit application'}
          </button>
        </div>
      </form>
    </FormProvider>
  )
}
