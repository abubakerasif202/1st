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
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to send your request.')
    }
  }

  return <form className="form-grid quick-quote-form" aria-label="Quick freight quote" onSubmit={handleSubmit(onSubmit)} noValidate>
    <FormField label="Name" registration={register('name')} error={errors.name}/>
    <FormField label="Company (optional)" registration={register('companyName')} error={errors.companyName}/>
    <FormField label="Email" type="email" registration={register('email')} error={errors.email}/>
    <FormField label="Phone" type="tel" registration={register('phone')} error={errors.phone}/>
    <FormField label="Pickup suburb or postcode" registration={register('pickup')} error={errors.pickup}/>
    <FormField label="Delivery suburb or postcode" registration={register('delivery')} error={errors.delivery}/>
    <label className="form-field full" htmlFor="quick-freight"><span>What are you moving?</span><textarea id="quick-freight" rows={4} {...register('freight')} aria-invalid={!!errors.freight} aria-describedby={errors.freight ? 'quick-freight-error' : undefined}/>{errors.freight && <small id="quick-freight-error" role="alert">{errors.freight.message}</small>}</label>
    <label className="check-field full"><input type="checkbox" {...register('consent')}/><span>I consent to 1st Class Express using these details to respond to my quote request.</span></label>
    {errors.consent && <small className="full form-error" role="alert">{errors.consent.message}</small>}
    <label className="honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" {...register('website')}/></label>
    <button className="btn-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Get My Free Quote'}</button>
    {status && <p className="form-status full" role="status">{status}</p>}
  </form>
}
