import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'

export function FormField({ label, error, registration, type = 'text', placeholder, className = '' }: { label: string; error?: FieldError; registration: UseFormRegisterReturn; type?: string; placeholder?: string; className?: string }) {
  const id = registration.name
  const autocomplete: Record<string, string> = { firstName: 'given-name', lastName: 'family-name', name: 'name', companyName: 'organization', email: 'email', phone: 'tel', pickup: 'postal-code', delivery: 'postal-code' }
  return <label className={`form-field ${className}`} htmlFor={id}><span>{label}</span><input id={id} type={type} placeholder={placeholder} autoComplete={autocomplete[id] ?? 'off'} {...registration} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}/>{error && <small id={`${id}-error`} role="alert">{error.message}</small>}</label>
}
