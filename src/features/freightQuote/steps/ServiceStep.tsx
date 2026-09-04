import { useFormContext, useWatch } from 'react-hook-form'
import { RadioGroup, TextAreaField, TextField } from '../fields'
import { DELIVERY_AUTHORITY_OPTIONS, SERVICE_PRIORITY_OPTIONS } from '../options'
import type { QuoteFormValues } from '../schema'

function HandlingSummary({
  title,
  tailgate,
  forklift,
  dock,
}: {
  title: string
  tailgate?: boolean
  forklift?: boolean
  dock?: boolean
}) {
  return (
    <div className="fq-handling-summary">
      <h4>{title}</h4>
      <ul>
        <li>Tailgate required: <strong>{tailgate ? 'Yes' : 'No'}</strong></li>
        <li>Forklift available: <strong>{forklift ? 'Yes' : 'No'}</strong></li>
        <li>Loading dock: <strong>{dock ? 'Yes' : 'No'}</strong></li>
      </ul>
    </div>
  )
}

export function ServiceStep() {
  const { control } = useFormContext<QuoteFormValues>()
  const [priority, authority, values] = [
    useWatch({ control, name: 'servicePriority' }),
    useWatch({ control, name: 'deliveryAuthority' }),
    useWatch({ control }),
  ]

  return (
    <div className="fq-step-grid">
      <div className="fq-span-2">
        <RadioGroup
          name="servicePriority"
          legend="Delivery priority"
          required
          options={SERVICE_PRIORITY_OPTIONS}
        />
      </div>

      {priority === 'specific_date' && (
        <TextField
          name="serviceSpecificDate"
          label="Required delivery date"
          required
          type="date"
        />
      )}

      <div className="fq-span-2">
        <RadioGroup
          name="deliveryAuthority"
          legend="Delivery authority"
          required
          options={DELIVERY_AUTHORITY_OPTIONS}
        />
      </div>

      {authority === 'atl' && (
        <TextAreaField
          name="atlInstructions"
          label="Where may the freight safely be left?"
          required
          className="fq-span-2"
          placeholder="e.g. Under the front verandah, out of view from the street."
        />
      )}

      <div className="fq-span-2 fq-handling-summaries">
        <HandlingSummary
          title="Pickup access"
          tailgate={values.pickupTailgateRequired}
          forklift={values.pickupForkliftAvailable}
          dock={values.pickupLoadingDockAvailable}
        />
        <HandlingSummary
          title="Delivery access"
          tailgate={values.deliveryTailgateRequired}
          forklift={values.deliveryForkliftAvailable}
          dock={values.deliveryLoadingDockAvailable}
        />
      </div>
    </div>
  )
}
