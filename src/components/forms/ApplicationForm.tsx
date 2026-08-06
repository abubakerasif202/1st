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
const employmentTypeOptions = ['Full-time', 'Part-time', 'Casual', 'Contract']
const availabilityOptions = ['Immediate', 'Within 2 weeks', 'Within 1 month', 'Flexible / to be discussed']
const operatingAreaOptions = ['Local only', 'Interstate only', 'Both local and interstate']
const licenceClassOptions = ['Car licence / Provisional', 'LR', 'MR', 'HR', 'HC', 'MC']
const experienceOptions = ['Less than 1 year', '1–2 years', '3–5 years', '6–10 years', '10+ years']
const yesNoOptions = ['Yes', 'No']
const yesNoNaOptions = ['Yes', 'No', 'Not applicable']
const preEmploymentOptions = ['Yes', 'No', 'Please discuss with me']
const stateOptions = ['NSW', 'QLD', 'VIC', 'SA', 'WA', 'TAS', 'NT', 'ACT']

const schema = z.object({
  firstName: z.string().min(2, 'Enter your first name'),
  lastName: z.string().min(2, 'Enter your last name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().refine(v => /^(?:\+?61|0)[2-478]\d{8}$/.test(v.replace(/[\s-]/g, '')), 'Enter a valid Australian phone number'),
  suburb: z.string().min(2, 'Enter your suburb'),
  state: z.string().min(1, 'Select your state'),
  postcode: z.string().regex(/^\d{4}$/, 'Enter a valid 4-digit postcode'),

  role: z.string().min(1, 'Select the role you are applying for'),
  employmentType: z.string().min(1, 'Select your preferred employment type'),
  availability: z.string().min(1, 'Select your availability'),
  operatingArea: z.string().min(1, 'Select your preferred operating area'),

  licenceClass: z.string().min(1, 'Select your current licence class'),
  licenceExpiry: z.string().min(1, 'Enter your licence expiry date'),
  yearsExperience: z.string().min(1, 'Select your years of driving experience'),
  vehicleTypes: z.string().min(3, 'List the vehicle types you have driven'),
  interstateExperience: z.string().min(1, 'Select an option'),
  refrigeratedExperience: z.string().min(1, 'Select an option'),
  dangerousGoodsExperience: z.string().min(1, 'Select an option'),
  dangerousGoodsDetails: z.string().optional(),
  fatigueManagement: z.string().min(1, 'Select an option'),

  rightToWork: z.string().min(1, 'Select an option'),
  preEmploymentAssessment: z.string().min(1, 'Select an option'),
  employmentHistory: z.string().min(10, 'Provide a brief employment history'),
  reasonForApplying: z.string().min(10, 'Tell us why you are applying for this role'),
  additionalInfo: z.string().optional(),

  resume: z.custom<FileList>(v => v instanceof FileList, 'Attach your résumé')
    .refine(list => list.length === 1, 'Attach your résumé (PDF, DOC or DOCX)')
    .refine(withinSizeLimit, 'File must be 5MB or smaller')
    .refine(acceptedFileList, 'Accepted formats: PDF, DOC or DOCX'),
  coverLetter: z.custom<FileList>(v => v instanceof FileList, 'Invalid file')
    .refine(list => list.length <= 1, 'Attach only one file')
    .refine(withinSizeLimit, 'File must be 5MB or smaller')
    .refine(acceptedFileList, 'Accepted formats: PDF, DOC or DOCX'),

  privacyAcknowledgement: z.literal(true, { errorMap: () => ({ message: 'Privacy acknowledgement is required' }) }),
  contactConsent: z.literal(true, { errorMap: () => ({ message: 'Consent to be contacted is required' }) }),
  accuracyConfirmation: z.literal(true, { errorMap: () => ({ message: 'Please confirm the information provided is accurate' }) }),
  website: z.string().max(0),
})
type Values = z.infer<typeof schema>

const safeFileName = (name: string) => name.replace(/[^\w.\-() ]+/g, '_').slice(-150)

function SelectField({ label, options, registration, error, required = true, placeholder = 'Select an option' }: { label: string; options: readonly string[]; registration: UseFormRegisterReturn; error?: FieldError; required?: boolean; placeholder?: string }) {
  const id = registration.name
  return <label className="form-field" htmlFor={id}>
    <span>{label}{required && <em className="required-mark" aria-hidden="true"> *</em>}</span>
    <select id={id} aria-required={required} {...registration} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}>
      <option value="">{placeholder}</option>
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
      firstName: '', lastName: '', email: '', phone: '', suburb: '', state: '', postcode: '',
      role: '', employmentType: '', availability: '', operatingArea: '',
      licenceClass: '', licenceExpiry: '', yearsExperience: '', vehicleTypes: '', interstateExperience: '', refrigeratedExperience: '', dangerousGoodsExperience: '', dangerousGoodsDetails: '', fatigueManagement: '',
      rightToWork: '', preEmploymentAssessment: '', employmentHistory: '', reasonForApplying: '', additionalInfo: '',
      website: '',
    },
  })

  useEffect(() => {
    const preset = searchParams.get('role')
    if (preset && roleOptions.includes(preset)) setValue('role', preset)
  }, [searchParams, setValue])

  const onSubmit = async (values: Values) => {
    const { resume, coverLetter, website, ...rest } = values
    const formData = new FormData()
    Object.entries(rest).forEach(([key, value]) => formData.append(key, value === undefined ? '' : String(value)))
    formData.append('website', website)
    formData.append('formType', 'careers')
    formData.append('_subject', `New driver application — ${values.role}`)
    if (resume[0]) formData.append('resume', resume[0], safeFileName(resume[0].name))
    if (coverLetter[0]) formData.append('coverLetter', coverLetter[0], safeFileName(coverLetter[0].name))
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

  if (submitted) return <div className="form-grid application-form"><p className={`form-status full form-status--success`} role="status">{status}</p></div>

  return <form className="form-grid application-form" onSubmit={handleSubmit(onSubmit)} noValidate>
    <fieldset className="full form-fieldset"><legend>Personal details</legend></fieldset>
    <FormField label="First name" registration={register('firstName')} error={errors.firstName} />
    <FormField label="Last name" registration={register('lastName')} error={errors.lastName} />
    <FormField label="Email" type="email" registration={register('email')} error={errors.email} />
    <FormField label="Primary phone number" type="tel" registration={register('phone')} error={errors.phone} />
    <FormField label="Suburb" registration={register('suburb')} error={errors.suburb} />
    <SelectField label="State" options={stateOptions} registration={register('state')} error={errors.state} />
    <FormField label="Postcode" registration={register('postcode')} error={errors.postcode} />

    <fieldset className="full form-fieldset"><legend>Role details</legend></fieldset>
    <SelectField label="Role being applied for" options={roleOptions} registration={register('role')} error={errors.role} />
    <SelectField label="Preferred employment type" options={employmentTypeOptions} registration={register('employmentType')} error={errors.employmentType} />
    <SelectField label="Availability" options={availabilityOptions} registration={register('availability')} error={errors.availability} />
    <SelectField label="Preferred operating area" options={operatingAreaOptions} registration={register('operatingArea')} error={errors.operatingArea} />

    <fieldset className="full form-fieldset"><legend>Driving experience</legend></fieldset>
    <SelectField label="Current licence class" options={licenceClassOptions} registration={register('licenceClass')} error={errors.licenceClass} />
    <FormField label="Licence expiry date" type="date" registration={register('licenceExpiry')} error={errors.licenceExpiry} />
    <SelectField label="Years of professional driving experience" options={experienceOptions} registration={register('yearsExperience')} error={errors.yearsExperience} />
    <FormField className="full" label="Vehicle types you have driven" placeholder="e.g. rigid trucks, semi-trailers, B-doubles" registration={register('vehicleTypes')} error={errors.vehicleTypes} />
    <SelectField label="Interstate driving experience" options={yesNoOptions} registration={register('interstateExperience')} error={errors.interstateExperience} />
    <SelectField label="Refrigerated freight experience" options={yesNoNaOptions} registration={register('refrigeratedExperience')} error={errors.refrigeratedExperience} />
    <SelectField label="Dangerous-goods experience or licence" options={yesNoNaOptions} registration={register('dangerousGoodsExperience')} error={errors.dangerousGoodsExperience} />
    <FormField className="full" label="Dangerous-goods licence / endorsement details" placeholder="If applicable" required={false} registration={register('dangerousGoodsDetails')} error={errors.dangerousGoodsDetails} />
    <SelectField label="Fatigue-management accreditation" options={yesNoNaOptions} registration={register('fatigueManagement')} error={errors.fatigueManagement} />

    <fieldset className="full form-fieldset"><legend>Application questions</legend></fieldset>
    <SelectField label="Legal right to work in Australia" options={yesNoOptions} registration={register('rightToWork')} error={errors.rightToWork} />
    <SelectField label="Able to complete a pre-employment assessment if required" options={preEmploymentOptions} registration={register('preEmploymentAssessment')} error={errors.preEmploymentAssessment} />
    <label className="form-field full" htmlFor="employmentHistory"><span>Brief employment history<em className="required-mark" aria-hidden="true"> *</em></span><textarea id="employmentHistory" rows={4} aria-required="true" {...register('employmentHistory')} aria-invalid={!!errors.employmentHistory} aria-describedby={errors.employmentHistory ? 'employmentHistory-error' : undefined} />{errors.employmentHistory && <small id="employmentHistory-error" role="alert">{errors.employmentHistory.message}</small>}</label>
    <label className="form-field full" htmlFor="reasonForApplying"><span>Reason for applying<em className="required-mark" aria-hidden="true"> *</em></span><textarea id="reasonForApplying" rows={4} aria-required="true" {...register('reasonForApplying')} aria-invalid={!!errors.reasonForApplying} aria-describedby={errors.reasonForApplying ? 'reasonForApplying-error' : undefined} />{errors.reasonForApplying && <small id="reasonForApplying-error" role="alert">{errors.reasonForApplying.message}</small>}</label>
    <label className="form-field full" htmlFor="additionalInfo"><span>Additional information <em>(optional)</em></span><textarea id="additionalInfo" rows={3} {...register('additionalInfo')} /></label>

    <fieldset className="full form-fieldset"><legend>Documents</legend></fieldset>
    <label className="form-field full" htmlFor="resume">
      <span>Résumé / CV<em className="required-mark" aria-hidden="true"> *</em></span>
      <input id="resume" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" aria-required="true" {...register('resume')} aria-invalid={!!errors.resume} aria-describedby={errors.resume ? 'resume-error' : 'resume-hint'} />
      <small id="resume-hint" className="field-hint">PDF, DOC or DOCX, up to 5MB.</small>
      {errors.resume && <small id="resume-error" role="alert">{errors.resume.message as string}</small>}
    </label>
    <label className="form-field full" htmlFor="coverLetter">
      <span>Cover letter <em>(optional)</em></span>
      <input id="coverLetter" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" {...register('coverLetter')} aria-invalid={!!errors.coverLetter} aria-describedby={errors.coverLetter ? 'coverLetter-error' : 'coverLetter-hint'} />
      <small id="coverLetter-hint" className="field-hint">PDF, DOC or DOCX, up to 5MB.</small>
      {errors.coverLetter && <small id="coverLetter-error" role="alert">{errors.coverLetter.message as string}</small>}
    </label>

    <fieldset className="full form-fieldset"><legend>Consent</legend></fieldset>
    <label className="check-field full"><input type="checkbox" aria-required="true" aria-invalid={!!errors.privacyAcknowledgement} aria-describedby={errors.privacyAcknowledgement ? 'privacyAcknowledgement-error' : undefined} {...register('privacyAcknowledgement')} /><span>I have read and acknowledge the privacy notice above.<em className="required-mark" aria-hidden="true"> *</em></span></label>{errors.privacyAcknowledgement && <small id="privacyAcknowledgement-error" className="full form-error" role="alert">{errors.privacyAcknowledgement.message}</small>}
    <label className="check-field full"><input type="checkbox" aria-required="true" aria-invalid={!!errors.contactConsent} aria-describedby={errors.contactConsent ? 'contactConsent-error' : undefined} {...register('contactConsent')} /><span>I consent to 1st Class Express contacting me about this application.<em className="required-mark" aria-hidden="true"> *</em></span></label>{errors.contactConsent && <small id="contactConsent-error" className="full form-error" role="alert">{errors.contactConsent.message}</small>}
    <label className="check-field full"><input type="checkbox" aria-required="true" aria-invalid={!!errors.accuracyConfirmation} aria-describedby={errors.accuracyConfirmation ? 'accuracyConfirmation-error' : undefined} {...register('accuracyConfirmation')} /><span>I confirm the information provided in this application is accurate.<em className="required-mark" aria-hidden="true"> *</em></span></label>{errors.accuracyConfirmation && <small id="accuracyConfirmation-error" className="full form-error" role="alert">{errors.accuracyConfirmation.message}</small>}

    <label className="honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" {...register('website')} /></label>
    <button className="btn-primary full" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Submit Application'}</button>
    {status && <p className={`form-status full ${isError ? 'form-status--error' : 'form-status--success'}`} role={isError ? 'alert' : 'status'}>{status}</p>}
  </form>
}
