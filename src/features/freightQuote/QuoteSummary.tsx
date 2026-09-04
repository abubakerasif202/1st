import type { ReactNode } from 'react'
import { lineVolumeM3 } from './calculations'
import {
  DELIVERY_AUTHORITY_LABELS,
  FREIGHT_ITEM_TYPE_LABELS,
  SERVICE_PRIORITY_LABELS,
} from './labels'
import type { QuoteFormValues } from './schema'
import type { QuoteTotals } from './types'

interface QuoteSummaryProps {
  data: QuoteFormValues
  totals: QuoteTotals
  /** When provided, each section shows an Edit button that jumps to that step index. */
  onEdit?: (stepIndex: number) => void
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="fq-summary__row">
      <dt>{label}</dt>
      <dd>{value || '—'}</dd>
    </div>
  )
}

function yesNo(value: boolean | undefined): string {
  return value ? 'Yes' : 'No'
}

function Section({
  title,
  stepIndex,
  onEdit,
  children,
}: {
  title: string
  stepIndex: number
  onEdit?: (stepIndex: number) => void
  children: ReactNode
}) {
  return (
    <section className="fq-summary__section">
      <div className="fq-summary__head">
        <h3>{title}</h3>
        {onEdit && (
          <button
            type="button"
            className="fq-btn fq-btn--link"
            onClick={() => onEdit(stepIndex)}
          >
            Edit
          </button>
        )}
      </div>
      <dl className="fq-summary__list">{children}</dl>
    </section>
  )
}

export function QuoteSummary({ data, totals, onEdit }: QuoteSummaryProps) {
  const pickupAddress = [data.pickupAddressLine1, data.pickupAddressLine2, `${data.pickupSuburb} ${data.pickupState} ${data.pickupPostcode}`]
    .filter(Boolean)
    .join(', ')
  const deliveryAddress = [data.deliveryAddressLine1, data.deliveryAddressLine2, `${data.deliverySuburb} ${data.deliveryState} ${data.deliveryPostcode}`]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="fq-summary">
      <Section title="Pickup" stepIndex={0} onEdit={onEdit}>
        <Row label="Address" value={pickupAddress} />
        <Row label="Contact" value={`${data.pickupContactName} · ${data.pickupContactPhone}`} />
        <Row label="Date" value={data.pickupDate} />
        <Row label="Ready / cutoff" value={`${data.pickupReadyTime || '—'} / ${data.pickupCutoffTime}`} />
        {data.pickupNotes && <Row label="Notes" value={data.pickupNotes} />}
      </Section>

      <Section title="Delivery" stepIndex={1} onEdit={onEdit}>
        <Row label="Address" value={deliveryAddress} />
        <Row label="Contact" value={`${data.deliveryContactName} · ${data.deliveryContactPhone}`} />
        <Row label="Requested date" value={data.requestedDeliveryDate || 'Flexible'} />
        <Row label="Cutoff" value={data.deliveryCutoffTime} />
        {data.deliveryNotes && <Row label="Notes" value={data.deliveryNotes} />}
      </Section>

      <Section title="Freight items" stepIndex={2} onEdit={onEdit}>
        {data.items.map((item, index) => (
          <div key={index} className="fq-summary__row fq-summary__row--full">
            <dt>Item {index + 1}</dt>
            <dd>
              {item.quantity} × {FREIGHT_ITEM_TYPE_LABELS[item.itemType]} ·{' '}
              {item.lengthCm}×{item.widthCm}×{item.heightCm} cm · {item.weightEachKg} kg each ·{' '}
              {lineVolumeM3(item)} m³
              {item.dangerousGoods ? ' · DG' : ''}
              {item.stackable ? '' : ' · not stackable'}
              {item.description ? ` — ${item.description}` : ''}
            </dd>
          </div>
        ))}
        <Row label="Total items" value={String(totals.totalItems)} />
        <Row label="Total weight" value={`${totals.totalWeightKg} kg`} />
        <Row label="Total volume" value={`${totals.totalVolumeM3} m³`} />
      </Section>

      <Section title="Service & handling" stepIndex={3} onEdit={onEdit}>
        <Row label="Priority" value={SERVICE_PRIORITY_LABELS[data.servicePriority]} />
        {data.servicePriority === 'specific_date' && (
          <Row label="Required date" value={data.serviceSpecificDate || '—'} />
        )}
        <Row label="Delivery authority" value={DELIVERY_AUTHORITY_LABELS[data.deliveryAuthority]} />
        {data.deliveryAuthority === 'atl' && (
          <Row label="Leave freight" value={data.atlInstructions || '—'} />
        )}
        <Row
          label="Pickup access"
          value={`Tailgate ${yesNo(data.pickupTailgateRequired)} · Forklift ${yesNo(data.pickupForkliftAvailable)} · Dock ${yesNo(data.pickupLoadingDockAvailable)}`}
        />
        <Row
          label="Delivery access"
          value={`Tailgate ${yesNo(data.deliveryTailgateRequired)} · Forklift ${yesNo(data.deliveryForkliftAvailable)} · Dock ${yesNo(data.deliveryLoadingDockAvailable)}`}
        />
      </Section>

      <Section title="Your details" stepIndex={4} onEdit={onEdit}>
        <Row label="Company" value={data.customerCompany || '—'} />
        <Row label="Name" value={data.customerName} />
        <Row label="Email" value={data.customerEmail} />
        <Row label="Phone" value={data.customerPhone} />
        {data.preferredContactMethod && (
          <Row label="Preferred contact" value={data.preferredContactMethod} />
        )}
        {data.customerReference && <Row label="PO / reference" value={data.customerReference} />}
        {data.customerNotes && <Row label="Notes" value={data.customerNotes} />}
      </Section>
    </div>
  )
}
