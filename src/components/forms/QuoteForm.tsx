import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { services } from '../../data/services'
import { submitQuoteRequest } from '../../lib/submitForms'
import { FormField } from './FormField'

const schema = z.object({
  firstName: z.string().min(2, 'Enter your first name'), lastName: z.string().min(2, 'Enter your last name'), companyName: z.string().min(2, 'Enter your company name'), email: z.string().email('Enter a valid email'), phone: z.string().min(8, 'Enter a valid phone number'), pickup: z.string().min(3, 'Enter pickup suburb or postcode'), delivery: z.string().min(3, 'Enter delivery suburb or postcode'), pickupDate: z.string().min(1, 'Select a preferred date'), serviceType: z.string().min(1, 'Select a service'), freight: z.string().min(10, 'Describe the freight'), items: z.string().min(1, 'Enter an approximate quantity'), urgency: z.string().min(1, 'Select urgency'), message: z.string().optional(), consent: z.literal(true, { errorMap: () => ({ message: 'Consent is required to submit' }) }), website: z.string().max(0),
})
type Values = z.infer<typeof schema>

const STEPS = [
  { label: 'Collection', heading: 'Collection Details' },
  { label: 'Delivery', heading: 'Delivery Details' },
  { label: 'Freight', heading: 'Freight Information' },
  { label: 'Contact', heading: 'Contact Details' },
  { label: 'Review', heading: 'Review And Submit' },
] as const

const STEP_FIELDS: Record<number, (keyof Values)[]> = {
  1: ['pickup', 'pickupDate'],
  2: ['delivery'],
  3: ['serviceType', 'urgency', 'freight', 'items'],
  4: ['firstName', 'lastName', 'companyName', 'email', 'phone'],
}

const QUANTITY_PRESETS = [
  '1–2 Pallets',
  '3–6 Pallets',
  'Full Truckload (FTL)',
  'Loose Cartons / Boxes',
  'Machinery / Oversize',
] as const

function QuoteStepper({ step, onStepClick }: { step: number; onStepClick: (targetStep: number) => void }) {
  return <ol className="quote-stepper" aria-label="Quote request steps">
    {STEPS.map((s, i) => {
      const stepNumber = i + 1
      const isComplete = stepNumber < step
      const isCurrent = stepNumber === step
      return <li key={s.label} className={`quote-stepper__step${isComplete ? ' is-complete' : ''}${isCurrent ? ' is-current' : ''}`} aria-current={isCurrent ? 'step' : undefined}>
        <button
          type="button"
          className="quote-stepper__btn"
          disabled={!isComplete && !isCurrent}
          onClick={() => isComplete && onStepClick(stepNumber)}
          aria-label={`Step ${stepNumber}: ${s.label}`}
        >
          <span className="quote-stepper__marker" aria-hidden="true">{isComplete ? '✓' : stepNumber}</span>
          <span className="quote-stepper__label">{s.label}</span>
        </button>
      </li>
    })}
  </ol>
}

export function QuoteForm() {
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(1)
  const [status, setStatus] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const isFirstRender = useRef(true)
  const { register, handleSubmit, trigger, getValues, setValue, formState: { errors, isSubmitting, isDirty } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { firstName:'', lastName:'', companyName:'', email:'', phone:'', pickup:'', delivery:'', pickupDate:'', serviceType:'', freight:'', items:'', urgency:'', message:'', website:'' } })

  useEffect(() => {
    const serviceParam = searchParams.get('service')
    const vehicleParam = searchParams.get('vehicle')
    const fromParam = searchParams.get('from')
    const toParam = searchParams.get('to')

    if (serviceParam) {
      const matched = services.find(s => s.slug === serviceParam || s.title.toLowerCase() === serviceParam.toLowerCase())
      if (matched) setValue('serviceType', matched.title, { shouldDirty: true })
    }
    if (vehicleParam) {
      setValue('freight', `Preferred vehicle / setup: ${vehicleParam}. `, { shouldDirty: true })
    }
    if (fromParam) setValue('pickup', fromParam, { shouldDirty: true })
    if (toParam) setValue('delivery', toParam, { shouldDirty: true })
  }, [searchParams, setValue])

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    document.getElementById('quote-step-heading')?.focus()
  }, [step])

  useEffect(() => {
    if (!isDirty || submitted) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty, submitted])

  const onSubmit = async (values: Values) => {
    try {
      const result = await submitQuoteRequest(values)
      setStatus(result.message)
      setSubmitted(true)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to send your request.')
    }
  }

  const goNext = async () => {
    const valid = await trigger(STEP_FIELDS[step])
    if (valid) setStep(s => s + 1)
  }
  const goBack = () => setStep(s => s - 1)

  if (submitted) {
    return <div className="quote-form quote-form--done"><p className="form-status" role="status">{status}</p></div>
  }

  const values = getValues()

  return <form className="form-grid quote-form" aria-label="Detailed freight quote" onSubmit={handleSubmit(onSubmit)} noValidate>
    <QuoteStepper step={step} onStepClick={(target) => setStep(target)} />

    {step === 1 && <>
      <h3 id="quote-step-heading" className="full" tabIndex={-1}>{STEPS[0].heading}</h3>
      <FormField label="Pickup suburb / postcode" registration={register('pickup')} error={errors.pickup}/>
      <FormField label="Preferred pickup date" type="date" registration={register('pickupDate')} error={errors.pickupDate}/>
    </>}

    {step === 2 && <>
      <h3 id="quote-step-heading" className="full" tabIndex={-1}>{STEPS[1].heading}</h3>
      <FormField className="full" label="Delivery suburb / postcode" registration={register('delivery')} error={errors.delivery}/>
    </>}

    {step === 3 && <>
      <h3 id="quote-step-heading" className="full" tabIndex={-1}>{STEPS[2].heading}</h3>
      <label className="form-field"><span>Service type<em className="required-mark" aria-hidden="true"> *</em></span><select required aria-required="true" {...register('serviceType')} aria-invalid={!!errors.serviceType} aria-describedby={errors.serviceType ? 'serviceType-error' : undefined}><option value="">Select a service</option>{services.map(s => <option key={s.title}>{s.title}</option>)}</select>{errors.serviceType && <small id="serviceType-error" role="alert">{errors.serviceType.message}</small>}</label>
      <label className="form-field"><span>Urgency<em className="required-mark" aria-hidden="true"> *</em></span><select required aria-required="true" {...register('urgency')} aria-invalid={!!errors.urgency} aria-describedby={errors.urgency ? 'urgency-error' : undefined}><option value="">Select urgency</option><option>Same day</option><option>Next day</option><option>Scheduled</option><option>Flexible</option></select>{errors.urgency && <small id="urgency-error" role="alert">{errors.urgency.message}</small>}</label>
      <label className="form-field full"><span>Freight description<em className="required-mark" aria-hidden="true"> *</em></span><textarea rows={4} required aria-required="true" {...register('freight')} aria-invalid={!!errors.freight} aria-describedby={errors.freight ? 'freight-error' : undefined}/>{errors.freight && <small id="freight-error" role="alert">{errors.freight.message}</small>}</label>
      <div className="full form-field">
        <FormField label="Approximate number of items / pallets" registration={register('items')} error={errors.items}/>
        <div className="quote-presets" role="group" aria-label="Common quantity options">
          <span className="quote-presets__title">Quick select:</span>
          {QUANTITY_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className="quote-preset-pill"
              onClick={() => setValue('items', preset, { shouldValidate: true, shouldDirty: true })}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </>}

    {step === 4 && <>
      <h3 id="quote-step-heading" className="full" tabIndex={-1}>{STEPS[3].heading}</h3>
      <FormField label="First name" registration={register('firstName')} error={errors.firstName}/>
      <FormField label="Last name" registration={register('lastName')} error={errors.lastName}/>
      <FormField label="Company name" registration={register('companyName')} error={errors.companyName}/>
      <FormField label="Email" type="email" registration={register('email')} error={errors.email}/>
      <FormField label="Phone" type="tel" registration={register('phone')} error={errors.phone}/>
    </>}

    {step === 5 && <>
      <h3 id="quote-step-heading" className="full" tabIndex={-1}>{STEPS[4].heading}</h3>
      <div className="quote-summary-sections full">
        <section className="quote-summary-section">
          <div className="quote-summary-section__head">
            <h4>Collection &amp; Delivery</h4>
            <button type="button" className="quote-summary__edit-btn" onClick={() => setStep(1)} aria-label="Edit collection and delivery details">Edit</button>
          </div>
          <dl className="quote-summary">
            <div className="quote-summary__item"><dt>Pickup</dt><dd>{values.pickup || '—'}</dd></div>
            <div className="quote-summary__item"><dt>Pickup date</dt><dd>{values.pickupDate || '—'}</dd></div>
            <div className="quote-summary__item quote-summary__item--full"><dt>Delivery</dt><dd>{values.delivery || '—'}</dd></div>
          </dl>
        </section>

        <section className="quote-summary-section">
          <div className="quote-summary-section__head">
            <h4>Freight Details</h4>
            <button type="button" className="quote-summary__edit-btn" onClick={() => setStep(3)} aria-label="Edit freight details">Edit</button>
          </div>
          <dl className="quote-summary">
            <div className="quote-summary__item"><dt>Service type</dt><dd>{values.serviceType || '—'}</dd></div>
            <div className="quote-summary__item"><dt>Urgency</dt><dd>{values.urgency || '—'}</dd></div>
            <div className="quote-summary__item quote-summary__item--full"><dt>Items / Pallets</dt><dd>{values.items || '—'}</dd></div>
            <div className="quote-summary__item quote-summary__item--full"><dt>Freight description</dt><dd>{values.freight || '—'}</dd></div>
          </dl>
        </section>

        <section className="quote-summary-section">
          <div className="quote-summary-section__head">
            <h4>Contact Details</h4>
            <button type="button" className="quote-summary__edit-btn" onClick={() => setStep(4)} aria-label="Edit contact details">Edit</button>
          </div>
          <dl className="quote-summary">
            <div className="quote-summary__item"><dt>Name</dt><dd>{`${values.firstName} ${values.lastName}`.trim() || '—'}</dd></div>
            <div className="quote-summary__item"><dt>Company</dt><dd>{values.companyName || '—'}</dd></div>
            <div className="quote-summary__item"><dt>Email</dt><dd>{values.email || '—'}</dd></div>
            <div className="quote-summary__item"><dt>Phone</dt><dd>{values.phone || '—'}</dd></div>
          </dl>
        </section>
      </div>

      <label className="form-field full"><span>Message / special instructions <em>(optional)</em></span><textarea rows={4} {...register('message')}/></label>
      <label className="check-field full"><input type="checkbox" required aria-required="true" aria-invalid={submitAttempted && !!errors.consent} aria-describedby={submitAttempted && errors.consent ? 'quote-consent-error' : undefined} {...register('consent')}/><span>I consent to 1st Class Express using these details to respond to my quote request.<em className="required-mark" aria-hidden="true"> *</em></span></label>{submitAttempted && errors.consent && <small id="quote-consent-error" className="full form-error" role="alert">{errors.consent.message}</small>}
      {/*
      Honeypot. `aria-hidden` on a wrapper that contains a focusable input is the
      aria-hidden-focus violation; `inert` is the attribute actually designed for
      this — it removes the subtree from the accessibility tree *and* from focus
      order, so there is no hidden-but-reachable control. The field still renders,
      still registers and still submits, so the empty-value check is unchanged.
    */}
    <div className="honeypot" inert=""><label htmlFor="website">Website</label><input id="website" tabIndex={-1} autoComplete="off" {...register('website')}/></div>
    </>}

    <div className="quote-form-nav full">
      {step > 1 ? <button type="button" className="btn-outline" onClick={goBack}>Back</button> : <span/>}
      {step < 5
        ? <button type="button" className="btn-primary" onClick={goNext}>Next</button>
        : <button className="btn-primary" type="submit" disabled={isSubmitting} onClick={() => setSubmitAttempted(true)}>{isSubmitting ? 'Sending…' : 'Request My Quote'}</button>}
    </div>
    {status && !submitted && <p className="form-status full" role="status">{status}</p>}
  </form>
}
