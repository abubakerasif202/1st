// Form primitives for the freight wizard. Every control is wired to the RHF
// context by `name`, renders a real <label>, and links its error text with
// aria-describedby. Checkboxes are grouped in a <fieldset><legend>.

import type { ReactNode } from 'react'
import { get, useFormContext } from 'react-hook-form'

function useFieldError(name: string): string | undefined {
  const {
    formState: { errors },
  } = useFormContext()
  const error = get(errors, name)
  return typeof error?.message === 'string' ? error.message : undefined
}

interface BaseProps {
  name: string
  label: string
  required?: boolean
  hint?: string
  autoComplete?: string
  className?: string
}

function FieldShell({
  name,
  label,
  required,
  hint,
  error,
  children,
}: BaseProps & { error?: string; children: ReactNode }) {
  const hintId = hint ? `${name}-hint` : undefined
  const errorId = error ? `${name}-error` : undefined
  return (
    <div className={`fq-field${error ? ' fq-field--invalid' : ''}`}>
      <label htmlFor={name} className="fq-field__label">
        {label}
        {required && (
          <em className="fq-field__req" aria-hidden="true">
            {' '}
            *
          </em>
        )}
      </label>
      {hint && (
        <p id={hintId} className="fq-field__hint">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <small id={errorId} className="fq-field__error" role="alert">
          {error}
        </small>
      )}
    </div>
  )
}

export function TextField({
  type = 'text',
  placeholder,
  inputMode,
  ...base
}: BaseProps & {
  type?: string
  placeholder?: string
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email'
}) {
  const { register } = useFormContext()
  const error = useFieldError(base.name)
  return (
    <FieldShell {...base} error={error}>
      <input
        id={base.name}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        autoComplete={base.autoComplete ?? 'off'}
        aria-required={base.required || undefined}
        aria-invalid={!!error}
        aria-describedby={
          [base.hint ? `${base.name}-hint` : '', error ? `${base.name}-error` : '']
            .filter(Boolean)
            .join(' ') || undefined
        }
        className="fq-field__control"
        {...register(base.name)}
      />
    </FieldShell>
  )
}

export function NumberField({
  min,
  max,
  step,
  unit,
  ...base
}: BaseProps & { min?: number; max?: number; step?: number; unit?: string }) {
  const { register } = useFormContext()
  const error = useFieldError(base.name)
  return (
    <FieldShell {...base} error={error}>
      <div className="fq-field__number">
        <input
          id={base.name}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step ?? 'any'}
          autoComplete="off"
          aria-required={base.required || undefined}
          aria-invalid={!!error}
          aria-describedby={
            [base.hint ? `${base.name}-hint` : '', error ? `${base.name}-error` : '']
              .filter(Boolean)
              .join(' ') || undefined
          }
          className="fq-field__control"
          {...register(base.name, { valueAsNumber: true })}
        />
        {unit && <span className="fq-field__unit" aria-hidden="true">{unit}</span>}
      </div>
    </FieldShell>
  )
}

export function SelectField({
  options,
  placeholder,
  ...base
}: BaseProps & { options: ReadonlyArray<{ value: string; label: string }>; placeholder?: string }) {
  const { register } = useFormContext()
  const error = useFieldError(base.name)
  return (
    <FieldShell {...base} error={error}>
      <select
        id={base.name}
        aria-required={base.required || undefined}
        aria-invalid={!!error}
        aria-describedby={
          [base.hint ? `${base.name}-hint` : '', error ? `${base.name}-error` : '']
            .filter(Boolean)
            .join(' ') || undefined
        }
        className="fq-field__control"
        {...register(base.name)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

export function TextAreaField({
  rows = 3,
  placeholder,
  ...base
}: BaseProps & { rows?: number; placeholder?: string }) {
  const { register } = useFormContext()
  const error = useFieldError(base.name)
  return (
    <FieldShell {...base} error={error}>
      <textarea
        id={base.name}
        rows={rows}
        placeholder={placeholder}
        aria-required={base.required || undefined}
        aria-invalid={!!error}
        aria-describedby={
          [base.hint ? `${base.name}-hint` : '', error ? `${base.name}-error` : '']
            .filter(Boolean)
            .join(' ') || undefined
        }
        className="fq-field__control"
        {...register(base.name)}
      />
    </FieldShell>
  )
}

export function CheckboxField({ name, label }: { name: string; label: string }) {
  const { register } = useFormContext()
  return (
    <label htmlFor={name} className="fq-check">
      <input id={name} type="checkbox" className="fq-check__box" {...register(name)} />
      <span>{label}</span>
    </label>
  )
}

export function CheckboxGroup({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="fq-fieldset">
      <legend className="fq-fieldset__legend">{legend}</legend>
      <div className="fq-check-grid">{children}</div>
    </fieldset>
  )
}

export function RadioGroup({
  name,
  legend,
  options,
  required,
}: {
  name: string
  legend: string
  options: ReadonlyArray<{ value: string; label: string; description?: string }>
  required?: boolean
}) {
  const { register } = useFormContext()
  const error = useFieldError(name)
  return (
    <fieldset className={`fq-fieldset${error ? ' fq-fieldset--invalid' : ''}`}>
      <legend className="fq-fieldset__legend">
        {legend}
        {required && <em aria-hidden="true"> *</em>}
      </legend>
      <div className="fq-radio-grid">
        {options.map((option) => (
          <label key={option.value} htmlFor={`${name}-${option.value}`} className="fq-radio">
            <input
              id={`${name}-${option.value}`}
              type="radio"
              value={option.value}
              aria-invalid={!!error}
              {...register(name)}
            />
            <span className="fq-radio__body">
              <span className="fq-radio__label">{option.label}</span>
              {option.description && (
                <span className="fq-radio__desc">{option.description}</span>
              )}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <small id={`${name}-error`} className="fq-field__error" role="alert">
          {error}
        </small>
      )}
    </fieldset>
  )
}
