import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'

export function FormField({ label, error, registration, type = 'text', placeholder, className = '', required = true }: { label: string; error?: FieldError; registration: UseFormRegisterReturn; type?: string; placeholder?: string; className?: string; required?: boolean }) {
  const id = registration.name
  const autocomplete: Record<string, string> = { firstName: 'given-name', lastName: 'family-name', name: 'name', companyName: 'organization', email: 'email', phone: 'tel', pickup: 'postal-code', delivery: 'postal-code' }
  const noSpellCheck = type === 'email' || type === 'tel' || id === 'email' || id === 'phone'
  return <label className={`form-field ${className}`} htmlFor={id}><span>{label}{required && <em className="required-mark" aria-hidden="true"> *</em>}</span><input id={id} type={type} placeholder={placeholder} autoComplete={autocomplete[id] ?? 'off'} spellCheck={noSpellCheck ? false : undefined} required={required} aria-required={required} {...registration} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}/>{error && <small id={`${id}-error`} role="alert">{error.message}</small>}</label>
}
