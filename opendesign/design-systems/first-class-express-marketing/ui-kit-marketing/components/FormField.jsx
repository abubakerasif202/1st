export function FormField({ label, id, type = 'text', error }) {
  return <label className="form-field" htmlFor={id}>
    <span>{label}</span>
    <input id={id} name={id} type={type} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
    {error && <small id={`${id}-error`} role="alert">{error}</small>}
  </label>
}
