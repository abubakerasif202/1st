import { RadioGroup, TextAreaField, TextField } from '../fields.js'
import { CONTACT_METHOD_OPTIONS } from '../options.js'

export function CustomerStep() {
  return (
    <div className="fq-step-grid">
      <TextField
        name="customerCompany"
        label="Company name"
        autoComplete="organization"
        className="fq-span-2"
      />
      <TextField name="customerName" label="Full name" required autoComplete="name" />
      <TextField
        name="customerEmail"
        label="Email"
        required
        type="email"
        inputMode="email"
        autoComplete="email"
      />
      <TextField
        name="customerPhone"
        label="Phone / mobile"
        required
        type="tel"
        inputMode="tel"
        autoComplete="tel"
      />
      <TextField
        name="customerReference"
        label="Customer PO / reference"
        autoComplete="off"
        hint="Optional — printed on the confirmation and quote."
      />

      <div className="fq-span-2">
        <RadioGroup
          name="preferredContactMethod"
          legend="Preferred contact method"
          options={CONTACT_METHOD_OPTIONS}
        />
      </div>

      <TextAreaField
        name="customerNotes"
        label="Additional notes"
        className="fq-span-2"
        rows={4}
        placeholder="Anything else that helps us quote accurately."
      />
    </div>
  )
}
