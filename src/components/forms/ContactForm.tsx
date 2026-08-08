import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { submitContactRequest } from '../../lib/submitForms'
import { FormField } from './FormField'

const schema = z.object({ name: z.string().min(2, 'Enter your name'), email: z.string().email('Enter a valid email'), phone: z.string().min(8, 'Enter a valid phone number'), message: z.string().min(10, 'Tell us a little more'), website: z.string().max(0) })
type Values = z.infer<typeof schema>

export function ContactForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState('')
  const [isError, setIsError] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: '', email: '', phone: '', message: '', website: '' } })
  const onSubmit = async (values: Values) => {
    try { setStatus((await submitContactRequest(values)).message); setIsError(false) }
    catch (error) { setStatus(error instanceof Error ? error.message : 'Unable to send your request.'); setIsError(true) }
  }
  return <form className={`form-grid ${compact ? 'compact-form' : ''}`} aria-label="Contact enquiry" onSubmit={handleSubmit(onSubmit)} noValidate>
    <FormField label="Name" registration={register('name')} error={errors.name}/><FormField label="Email" type="email" registration={register('email')} error={errors.email}/><FormField label="Phone" type="tel" registration={register('phone')} error={errors.phone}/>
    <label className="form-field full" htmlFor="message"><span>How can we help?<em className="required-mark" aria-hidden="true"> *</em></span><textarea id="message" rows={compact ? 4 : 6} required aria-required="true" {...register('message')} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined}/>{errors.message && <small id="message-error" role="alert">{errors.message.message}</small>}</label>
    <label className="honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" {...register('website')}/></label>
    <button className="btn-primary" disabled={isSubmitting} type="submit">{isSubmitting ? 'Sending…' : 'Send Enquiry'}</button>{status && <p className={`form-status ${isError ? 'form-status--error' : 'form-status--success'}`} role={isError ? 'alert' : 'status'}>{status}</p>}
  </form>
}
