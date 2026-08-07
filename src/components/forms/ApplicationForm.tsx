import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { driverRoles } from '../../data/roles'
import { submitCareersApplication } from '../../lib/submitForms'
import { FormField } from './FormField'

const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const MAX_FILE_BYTES = 5 * 1024 * 1024
const acceptedFileList = (list: FileList) => list.length === 0 || (list.length === 1 && ACCEPTED_FILE_TYPES.includes(list[0].type))
const withinSizeLimit = (list: FileList) => list.length === 0 || (list.length === 1 && list[0].size <= MAX_FILE_BYTES)

const roleOptions = driverRoles.map(role => role.title)
const availabilityOptions = ['Immediate', 'Within 2 weeks', 'Within 1 month', 'Flexible / to be discussed']
const operatingAreaOptions = ['Local only', 'Interstate only', 'Both local and interstate']
const licenceClassOptions = ['Car licence / Provisional', 'LR', 'MR', 'HR', 'HC', 'MC']
const experienceOptions = ['Less than 1 year', '1–2 years', '3–5 years', '6–10 years', '10+ years']
const yesNoOptions = ['Yes', 'No']

const schema = z.object({
  firstName: z.string().min(2, 'Enter your first name'),
  lastName: z.string().min(2, 'Enter your last name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().refine(v => /^(?:\+?61|0)[2-478]\d{8}$/.test(v.replace(/[\s-]/g, '')), 'Enter a valid Australian phone number'),
  suburb: z.string().min(2, 'Enter your suburb'),
  role: z.string().min(1, 'Select the role you are applying for'),
  availability: z.string().min(1, 'Select your availability'),
  operatingArea: z.string().min(1, 'Select your preferred operating area'),
  licenceClass: z.string().min(1, 'Select your current licence class'),
  yearsExperience: z.string().min(1, 'Select your years of driving experience'),
  vehicleTypes: z.string().min(3, 'List the vehicle types you have driven'),
  rightToWork: z.string().min(1, 'Select an option'),
  notes: z.string().optional(),
  resume: z.custom<FileList>(v => v instanceof FileList, 'Attach your résumé')
    .refine(list => list.length === 1, 'Attach your résumé (PDF, DOC or DOCX)')
    .refine(withinSizeLimit, 'File must be 5MB or smaller')
    .refine(acceptedFileList, 'Accepted formats: PDF, DOC or DOCX'),
  privacyAcknowledgement: z.literal(true, { errorMap: () => ({ message: 'Privacy acknowledgement is required' }) }),
  website: z.string().max(0),
})
type Values = z.infer<typeof schema>

const safeFileName = (name: string) => name.replace(/[^\w.\-() ]+/g, '_').slice(-150)

function SelectField({ label, options, registration, error }: { label: string; options: readonly string[]; registration: UseFormRegisterReturn; error?: FieldError }) {
  const id = registration.name
  return <label className="form-field" htmlFor={id}>
    <span>{label}<em className="required-mark" aria-hidden="true"> *</em></span>
    <select id={id} required aria-required="true" {...registration} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}>
      <option value="">Select an option</option>
      {options.map(option => <option key={option}>{option}</option>)}
    </select>
    {error && <small id={`${id}-error`} role="alert">{error.message}</small>}
  </label>
}

export function ApplicationForm() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('')
  const [isError, setIsError] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '', lastName: '', email: '', phone: '', suburb: '', role: '', availability: '',
      operatingArea: '', licenceClass: '', yearsExperience: '', vehicleTypes: '', rightToWork: '', notes: '', website: '',
    },
  })

  useEffect(() => {
    const preset = searchParams.get('role')
    if (preset && roleOptions.includes(preset)) setValue('role', preset)
  }, [searchParams, setValue])

  const onSubmit = async (values: Values) => {
    const { resume, website, ...rest } = values
    const formData = new FormData()
    Object.entries(rest).forEach(([key, value]) => formData.append(key, String(value ?? '')))
    formData.append('website', website)
    formData.append('formType', 'careers')
    formData.append('_subject', `New driver application — ${values.role}`)
    if (resume[0]) formData.append('resume', resume[0], safeFileName(resume[0].name))
    try {
      const result = await submitCareersApplication(formData)
      setStatus(result.message)
      setIsError(false)
      setSubmitted(true)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to send your application.')
      setIsError(true)
    }
  }

  if (submitted) return <div className="form-grid application-form"><p className="form-status full form-status--success" role="status">{status}</p></div>

  return <form className="form-grid application-form" aria-label="Driver application" onSubmit={handleSubmit(onSubmit)} noValidate>
    <fieldset className="full form-fieldset"><legend>Contact details</legend></fieldset>
    <FormField label="First name" registration={register('firstName')} error={errors.firstName}/>
    <FormField label="Last name" registration={register('lastName')} error={errors.lastName}/>
    <FormField label="Email" type="email" registration={register('email')} error={errors.email}/>
    <FormField label="Primary phone number" type="tel" registration={register('phone')} error={errors.phone}/>
    <FormField className="full" label="Suburb" registration={register('suburb')} error={errors.suburb}/>

    <fieldset className="full form-fieldset"><legend>First-stage screening</legend></fieldset>
    <SelectField label="Role being applied for" options={roleOptions} registration={register('role')} error={errors.role}/>
    <SelectField label="Availability" options={availabilityOptions} registration={register('availability')} error={errors.availability}/>
    <SelectField label="Preferred operating area" options={operatingAreaOptions} registration={register('operatingArea')} error={errors.operatingArea}/>
    <SelectField label="Current licence class" options={licenceClassOptions} registration={register('licenceClass')} error={errors.licenceClass}/>
    <SelectField label="Years of professional driving experience" options={experienceOptions} registration={register('yearsExperience')} error={errors.yearsExperience}/>
    <SelectField label="Legal right to work in Australia" options={yesNoOptions} registration={register('rightToWork')} error={errors.rightToWork}/>
    <FormField className="full" label="Vehicle types you have driven" placeholder="e.g. rigid trucks, semi-trailers, B-doubles" registration={register('vehicleTypes')} error={errors.vehicleTypes}/>
    <label className="form-field full" htmlFor="notes"><span>Relevant tickets, experience or notes <em>(optional)</em></span><textarea id="notes" rows={3} {...register('notes')}/></label>

    <fieldset className="full form-fieldset"><legend>Résumé and consent</legend></fieldset>
    <label className="form-field full" htmlFor="resume">
      <span>Résumé / CV<em className="required-mark" aria-hidden="true"> *</em></span>
      <input id="resume" type="file" required aria-required="true" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" {...register('resume')} aria-invalid={!!errors.resume} aria-describedby={errors.resume ? 'resume-error' : 'resume-hint'}/>
      <small id="resume-hint" className="field-hint">PDF, DOC or DOCX, up to 5MB.</small>
      {errors.resume && <small id="resume-error" role="alert">{errors.resume.message as string}</small>}
    </label>
    <label className="check-field full"><input type="checkbox" required aria-required="true" aria-invalid={!!errors.privacyAcknowledgement} aria-describedby={errors.privacyAcknowledgement ? 'privacyAcknowledgement-error' : undefined} {...register('privacyAcknowledgement')}/><span>I acknowledge the privacy notice and consent to 1st Class Express contacting me about this application.<em className="required-mark" aria-hidden="true"> *</em></span></label>
    {errors.privacyAcknowledgement && <small id="privacyAcknowledgement-error" className="full form-error" role="alert">{errors.privacyAcknowledgement.message}</small>}

    <label className="honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" {...register('website')}/></label>
    <button className="btn-primary full" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Submit Application'}</button>
    {status && <p className={`form-status full ${isError ? 'form-status--error' : 'form-status--success'}`} role={isError ? 'alert' : 'status'}>{status}</p>}
  </form>
}
