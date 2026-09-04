import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { INFRASTRUCTURE_MESSAGE, QuoteApiError, submitQuote } from './api'
import { FREIGHT_TERMS_VERSION } from './constants'
import { QuoteProgress } from './QuoteProgress'
import { clearDraft, recallDraft, rememberDraft, rememberQuoteToken } from './sessionStore'
import { emptyQuoteForm, quoteFormSchema, type QuoteFormValues } from './schema'
import { PickupStep } from './steps/PickupStep'
import { DeliveryStep } from './steps/DeliveryStep'
import { FreightItemsStep } from './steps/FreightItemsStep'
import { ServiceStep } from './steps/ServiceStep'
import { CustomerStep } from './steps/CustomerStep'
import { ReviewStep } from './steps/ReviewStep'
import { REVIEW_STEP_INDEX, WIZARD_STEPS } from './wizardSteps'

type BannerState = { kind: 'error' | 'info'; message: string } | null

/** First wizard step whose fields appear in the server's field-error map. */
function stepForFieldErrors(fieldErrors: Record<string, string[]>): number {
  const errored = new Set(Object.keys(fieldErrors).map((path) => path.split('.')[0]))
  const index = WIZARD_STEPS.findIndex((step) => step.fields.some((field) => errored.has(field)))
  return index === -1 ? 0 : index
}

export function QuoteWizard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [stepIndex, setStepIndex] = useState(0)
  const [furthestReached, setFurthestReached] = useState(0)
  const [banner, setBanner] = useState<BannerState>(null)
  const [submittedRef, setSubmittedRef] = useState<string | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const idempotencyKey = useRef<string>(
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `fce-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  )

  const methods = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    mode: 'onBlur',
    defaultValues: recallDraft<QuoteFormValues>() ?? emptyQuoteForm(),
  })
  const { handleSubmit, trigger, getValues, setValue, setError, watch, formState } = methods

  // Prefill pickup / delivery suburb from a deep link (e.g. a route page CTA).
  useEffect(() => {
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    if (from && !getValues('pickupSuburb')) setValue('pickupSuburb', from)
    if (to && !getValues('deliverySuburb')) setValue('deliverySuburb', to)
  }, [searchParams, getValues, setValue])

  // Persist an in-progress draft for accidental-reload recovery (session only).
  // watch(cb) is RHF's documented subscription API; the compiler cannot memoize
  // it but we only use it to fire a side effect, never to derive rendered state.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = watch((values) => {
      if (!submittedRef) rememberDraft(values)
    })
    return () => subscription.unsubscribe()
  }, [watch, submittedRef])

  // Warn before leaving with unsaved input.
  useEffect(() => {
    if (submittedRef || !formState.isDirty) return
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [submittedRef, formState.isDirty])

  // Move focus to the step heading on navigation.
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    headingRef.current?.focus()
  }, [stepIndex])

  const goToStep = useCallback((next: number) => {
    setStepIndex(next)
    setFurthestReached((prev) => Math.max(prev, next))
  }, [])

  const handleNext = useCallback(async () => {
    const valid = await trigger(WIZARD_STEPS[stepIndex].fields, { shouldFocus: true })
    if (valid) goToStep(stepIndex + 1)
  }, [trigger, stepIndex, goToStep])

  const onValid = useCallback(
    async (values: QuoteFormValues) => {
      setBanner(null)
      try {
        const { quote, token } = await submitQuote({
          form: values,
          idempotencyKey: idempotencyKey.current,
          termsVersion: FREIGHT_TERMS_VERSION,
        })
        rememberQuoteToken(quote.referenceNumber, token)
        clearDraft()
        setSubmittedRef(quote.referenceNumber)
        navigate(`/quote/${encodeURIComponent(quote.referenceNumber)}/confirmation`, {
          state: { quote, token },
        })
      } catch (error) {
        if (error instanceof QuoteApiError && error.kind === 'validation' && error.fieldErrors) {
          for (const [path, messages] of Object.entries(error.fieldErrors)) {
            setError(path as keyof QuoteFormValues, { type: 'server', message: messages[0] })
          }
          goToStep(stepForFieldErrors(error.fieldErrors))
          setBanner({ kind: 'error', message: 'Some details need attention — see the highlighted fields.' })
          return
        }
        if (error instanceof QuoteApiError && error.kind === 'infrastructure') {
          setBanner({ kind: 'error', message: INFRASTRUCTURE_MESSAGE })
          return
        }
        setBanner({
          kind: 'error',
          message:
            error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        })
      }
    },
    [navigate, setError, goToStep],
  )

  const step = WIZARD_STEPS[stepIndex]
  const isReview = stepIndex === REVIEW_STEP_INDEX
  const submitting = formState.isSubmitting

  const stepBody = useMemo(() => {
    switch (step.id) {
      case 'pickup':
        return <PickupStep />
      case 'delivery':
        return <DeliveryStep />
      case 'freight':
        return <FreightItemsStep />
      case 'service':
        return <ServiceStep />
      case 'customer':
        return <CustomerStep />
      case 'review':
        return <ReviewStep onEdit={goToStep} />
      default:
        return null
    }
  }, [step.id, goToStep])

  return (
    <FormProvider {...methods}>
      <form
        className="fq-wizard"
        noValidate
        onSubmit={handleSubmit(onValid)}
        aria-labelledby="fq-step-heading"
      >
        <QuoteProgress current={stepIndex} furthestReached={furthestReached} onJump={goToStep} />

        <div className="fq-wizard__panel">
          <h2 id="fq-step-heading" ref={headingRef} tabIndex={-1} className="fq-wizard__heading">
            {step.heading}
          </h2>
          <p className="fq-wizard__blurb">{step.blurb}</p>

          {banner && (
            <p
              className={`fq-banner fq-banner--${banner.kind}`}
              role={banner.kind === 'error' ? 'alert' : 'status'}
            >
              {banner.message}
            </p>
          )}

          {stepBody}
        </div>

        <div className="fq-wizard__nav">
          {stepIndex > 0 ? (
            <button
              type="button"
              className="fq-btn fq-btn--outline"
              onClick={() => setStepIndex((prev) => prev - 1)}
            >
              Back
            </button>
          ) : (
            <span />
          )}

          {isReview ? (
            <button type="submit" className="fq-btn fq-btn--primary" disabled={submitting}>
              {submitting ? 'Sending…' : 'Request my quote'}
            </button>
          ) : (
            <button type="button" className="fq-btn fq-btn--primary" onClick={handleNext}>
              Next
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}
