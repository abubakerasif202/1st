import { CheckboxField, CheckboxGroup, SelectField, TextAreaField, TextField } from '../fields.js'
import { STATE_OPTIONS } from '../options.js'

export function DeliveryStep() {
  return (
    <div className="fq-step-grid">
      <TextField
        name="deliveryAddressLine1"
        label="Exact delivery address"
        required
        autoComplete="address-line1"
        className="fq-span-2"
      />
      <TextField
        name="deliveryAddressLine2"
        label="Address line 2"
        autoComplete="address-line2"
        className="fq-span-2"
      />
      <TextField name="deliverySuburb" label="Suburb" required autoComplete="address-level2" />
      <SelectField
        name="deliveryState"
        label="State"
        required
        options={STATE_OPTIONS}
        placeholder="Select a state"
      />
      <TextField
        name="deliveryPostcode"
        label="Postcode"
        required
        inputMode="numeric"
        autoComplete="postal-code"
      />
      <div aria-hidden="true" className="fq-spacer" />

      <TextField
        name="deliveryContactName"
        label="Delivery contact person"
        required
        autoComplete="name"
      />
      <TextField
        name="deliveryContactPhone"
        label="Delivery phone / mobile"
        required
        type="tel"
        inputMode="tel"
        autoComplete="tel"
      />

      <TextField
        name="requestedDeliveryDate"
        label="Requested delivery date"
        type="date"
        hint="Leave blank if you are flexible."
      />
      <TextField
        name="deliveryCutoffTime"
        label="Delivery cutoff time"
        required
        type="time"
        hint="Latest the site can receive freight."
      />
      <div aria-hidden="true" className="fq-spacer" />

      <TextAreaField
        name="deliveryNotes"
        label="Delivery notes"
        className="fq-span-2"
        placeholder="Access restrictions, booking requirements, contact-on-approach…"
      />

      <div className="fq-span-2">
        <CheckboxGroup legend="Delivery site handling">
          <CheckboxField name="deliveryForkliftAvailable" label="Forklift available on site" />
          <CheckboxField name="deliveryTailgateRequired" label="Tailgate truck required" />
          <CheckboxField name="deliveryLoadingDockAvailable" label="Loading dock available" />
          <CheckboxField name="deliveryReceiverUnloads" label="Receiver will unload the freight" />
        </CheckboxGroup>
      </div>
    </div>
  )
}
