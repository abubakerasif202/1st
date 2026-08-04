import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { services } from '../../data/services'
import { submitQuoteRequest } from '../../lib/submitForms'
import { FormField } from './FormField'

const schema = z.object({
  firstName: z.string().min(2, 'Enter your first name'), lastName: z.string().min(2, 'Enter your last name'), companyName: z.string().min(2, 'Enter your company name'), email: z.string().email('Enter a valid email'), phone: z.string().min(8, 'Enter a valid phone number'), pickup: z.string().min(3, 'Enter pickup suburb or postcode'), delivery: z.string().min(3, 'Enter delivery suburb or postcode'), pickupDate: z.string().min(1, 'Select a preferred date'), serviceType: z.string().min(1, 'Select a service'), freight: z.string().min(10, 'Describe the freight'), items: z.string().min(1, 'Enter an approximate quantity'), urgency: z.string().min(1, 'Select urgency'), message: z.string().optional(), consent: z.literal(true, { errorMap: () => ({ message: 'Consent is required to submit' }) }), website: z.string().max(0),
})
type Values = z.infer<typeof schema>

export function QuoteForm() {
  const [status, setStatus] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { firstName:'', lastName:'', companyName:'', email:'', phone:'', pickup:'', delivery:'', pickupDate:'', serviceType:'', freight:'', items:'', urgency:'', message:'', website:'' } })
  const onSubmit = async (values: Values) => { try { setStatus((await submitQuoteRequest(values)).message) } catch (error) { setStatus(error instanceof Error ? error.message : 'Unable to send your request.') } }
  return <form className="form-grid quote-form" onSubmit={handleSubmit(onSubmit)} noValidate>
    <FormField label="First name" registration={register('firstName')} error={errors.firstName}/><FormField label="Last name" registration={register('lastName')} error={errors.lastName}/><FormField label="Company name" registration={register('companyName')} error={errors.companyName}/><FormField label="Email" type="email" registration={register('email')} error={errors.email}/><FormField label="Phone" type="tel" registration={register('phone')} error={errors.phone}/><FormField label="Preferred pickup date" type="date" registration={register('pickupDate')} error={errors.pickupDate}/><FormField label="Pickup suburb / postcode" registration={register('pickup')} error={errors.pickup}/><FormField label="Delivery suburb / postcode" registration={register('delivery')} error={errors.delivery}/>
    <label className="form-field"><span>Service type</span><select {...register('serviceType')} aria-invalid={!!errors.serviceType} aria-describedby={errors.serviceType ? 'serviceType-error' : undefined}><option value="">Select a service</option>{services.map(s => <option key={s.title}>{s.title}</option>)}</select>{errors.serviceType && <small id="serviceType-error" role="alert">{errors.serviceType.message}</small>}</label>
    <label className="form-field"><span>Urgency</span><select {...register('urgency')} aria-invalid={!!errors.urgency} aria-describedby={errors.urgency ? 'urgency-error' : undefined}><option value="">Select urgency</option><option>Same day</option><option>Next day</option><option>Scheduled</option><option>Flexible</option></select>{errors.urgency && <small id="urgency-error" role="alert">{errors.urgency.message}</small>}</label>
    <label className="form-field full"><span>Freight description</span><textarea rows={4} {...register('freight')} aria-invalid={!!errors.freight} aria-describedby={errors.freight ? 'freight-error' : undefined}/>{errors.freight && <small id="freight-error" role="alert">{errors.freight.message}</small>}</label>
    <FormField className="full" label="Approximate number of items / pallets" registration={register('items')} error={errors.items}/>
    <label className="form-field full"><span>Message / special instructions <em>(optional)</em></span><textarea rows={4} {...register('message')}/></label>
    <label className="check-field full"><input type="checkbox" {...register('consent')}/><span>I consent to 1st Class Express using these details to respond to my quote request.</span></label>{errors.consent && <small className="full form-error" role="alert">{errors.consent.message}</small>}
    <label className="honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" {...register('website')}/></label>
    <button className="btn-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Request My Quote'}</button>{status && <p className="form-status full" role="status">{status}</p>}
  </form>
}
