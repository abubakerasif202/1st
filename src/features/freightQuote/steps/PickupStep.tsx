import { CheckboxField, CheckboxGroup, SelectField, TextAreaField, TextField } from '../fields.js'
import { STATE_OPTIONS } from '../options.js'

export function PickupStep() {
  return (
    <div className="fq-step-grid">
      <TextField
        name="pickupAddressLine1"
        label="Exact pickup address"
        required
        autoComplete="address-line1"
        className="fq-span-2"
      />
      <TextField
        name="pickupAddressLine2"
        label="Address line 2"
        autoComplete="address-line2"
        className="fq-span-2"
      />
      <TextField name="pickupSuburb" label="Suburb" required autoComplete="address-level2" />
      <SelectField
        name="pickupState"
        label="State"
        required
        options={STATE_OPTIONS}
        placeholder="Select a state"
      />
      <TextField
        name="pickupPostcode"
        label="Postcode"
        required
        inputMode="numeric"
        autoComplete="postal-code"
      />
      <div aria-hidden="true" className="fq-spacer" />

      <TextField
        name="pickupContactName"
        label="Pickup contact person"
        required
        autoComplete="name"
      />
      <TextField
        name="pickupContactPhone"
        label="Pickup contact phone / mobile"
        required
        type="tel"
        inputMode="tel"
        autoComplete="tel"
      />

      <TextField name="pickupDate" label="Pickup date" required type="date" />
      <TextField
        name="pickupReadyTime"
        label="Ready-from time"
        type="time"
        hint="Earliest the freight can be collected."
      />
      <TextField
        name="pickupCutoffTime"
        label="Pickup cutoff time"
        required
        type="time"
        hint="Latest the site can release freight."
      />
      <div aria-hidden="true" className="fq-spacer" />

      <TextAreaField
        name="pickupNotes"
        label="Pickup notes"
        className="fq-span-2"
        placeholder="Gate codes, dock number, forklift driver name, site inductions…"
      />

      <div className="fq-span-2">
        <CheckboxGroup legend="Pickup site handling">
          <CheckboxField name="pickupForkliftAvailable" label="Forklift available on site" />
          <CheckboxField name="pickupTailgateRequired" label="Tailgate truck required" />
          <CheckboxField name="pickupLoadingDockAvailable" label="Loading dock available" />
          <CheckboxField name="pickupCustomerLoads" label="We will load the freight" />
        </CheckboxGroup>
      </div>
    </div>
  )
}
