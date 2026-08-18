import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { submitQuoteRequest } from '../../lib/submitForms'
import { FormField } from './FormField'

const schema = z.object({
  name: z.string().min(2, 'Enter your name'),
  companyName: z.string().optional(),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(8, 'Enter a valid phone number'),
  pickup: z.string().min(3, 'Enter pickup suburb or postcode'),
  delivery: z.string().min(3, 'Enter delivery suburb or postcode'),
  freight: z.string().min(10, 'Describe the freight'),
  consent: z.literal(true, { errorMap: () => ({ message: 'Consent is required to submit' }) }),
  website: z.string().max(0),
})

type Values = z.infer<typeof schema>

export function QuickQuoteForm() {
  const [status, setStatus] = useState('')
  const [isError, setIsError] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      companyName: '',
      email: '',
      phone: '',
      pickup: '',
      delivery: '',
      freight: '',
      website: '',
    },
  })

  const onSubmit = async (values: Values) => {
    try {
      setStatus((await submitQuoteRequest(values)).message)
      setIsError(false)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to send your request.')
      setIsError(true)
    }
  }

  return <form className="form-grid quick-quote-form" aria-label="Quick freight quote" onSubmit={handleSubmit(onSubmit)} noValidate>
    <FormField label="Name" registration={register('name')} error={errors.name}/>
    <FormField label="Company (optional)" required={false} registration={register('companyName')} error={errors.companyName}/>
    <FormField label="Email" type="email" registration={register('email')} error={errors.email}/>
    <FormField label="Phone" type="tel" registration={register('phone')} error={errors.phone}/>
    <FormField label="Pickup suburb or postcode" registration={register('pickup')} error={errors.pickup}/>
    <FormField label="Delivery suburb or postcode" registration={register('delivery')} error={errors.delivery}/>
    <label className="form-field full" htmlFor="quick-freight"><span>What are you moving?<em className="required-mark" aria-hidden="true"> *</em></span><textarea id="quick-freight" rows={4} required aria-required="true" {...register('freight')} aria-invalid={!!errors.freight} aria-describedby={errors.freight ? 'quick-freight-error' : undefined}/>{errors.freight && <small id="quick-freight-error" role="alert">{errors.freight.message}</small>}</label>
    <label className="check-field full"><input type="checkbox" required aria-required="true" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'quick-consent-error' : undefined} {...register('consent')}/><span>I consent to 1st Class Express using these details to respond to my quote request.<em className="required-mark" aria-hidden="true"> *</em></span></label>
    {errors.consent && <small id="quick-consent-error" className="full form-error" role="alert">{errors.consent.message}</small>}
    {/*
      Honeypot. `aria-hidden` on a wrapper that contains a focusable input is the
      aria-hidden-focus violation; `inert` is the attribute actually designed for
      this — it removes the subtree from the accessibility tree *and* from focus
      order, so there is no hidden-but-reachable control. The field still renders,
      still registers and still submits, so the empty-value check is unchanged.
    */}
    <div className="honeypot" inert=""><label htmlFor="website">Website</label><input id="website" tabIndex={-1} autoComplete="off" {...register('website')}/></div>
    <button className="btn-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Get My Free Quote'}</button>
    {status && <p className={`form-status full ${isError ? 'form-status--error' : 'form-status--success'}`} role={isError ? 'alert' : 'status'}>{status}</p>}
  </form>
}
