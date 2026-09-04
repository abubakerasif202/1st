// Step metadata for the 6-step quote wizard. `fields` is the set react-hook-form
// re-validates before letting the user advance past that step.

import type { QuoteFormValues } from './schema'

export type QuoteFieldName = keyof QuoteFormValues

export interface WizardStep {
  id: string
  label: string
  heading: string
  blurb: string
  fields: QuoteFieldName[]
}

export const WIZARD_STEPS: readonly WizardStep[] = [
  {
    id: 'pickup',
    label: 'Pickup',
    heading: 'Pickup Details',
    blurb: 'Where we collect the freight, who to see, and the access on site.',
    fields: [
      'pickupAddressLine1',
      'pickupAddressLine2',
      'pickupSuburb',
      'pickupState',
      'pickupPostcode',
      'pickupContactName',
      'pickupContactPhone',
      'pickupDate',
      'pickupReadyTime',
      'pickupCutoffTime',
      'pickupNotes',
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery',
    heading: 'Delivery Details',
    blurb: 'Where the freight is going, who receives it, and the access on site.',
    fields: [
      'deliveryAddressLine1',
      'deliveryAddressLine2',
      'deliverySuburb',
      'deliveryState',
      'deliveryPostcode',
      'deliveryContactName',
      'deliveryContactPhone',
      'requestedDeliveryDate',
      'deliveryCutoffTime',
      'deliveryNotes',
    ],
  },
  {
    id: 'freight',
    label: 'Freight',
    heading: 'Freight Items',
    blurb: 'Add each type of item. Dimensions and weights let us plan the right vehicle.',
    fields: ['items'],
  },
  {
    id: 'service',
    label: 'Service',
    heading: 'Service & Handling',
    blurb: 'How quickly it needs to move and how it should be left on delivery.',
    fields: ['servicePriority', 'serviceSpecificDate', 'deliveryAuthority', 'atlInstructions'],
  },
  {
    id: 'customer',
    label: 'Your details',
    heading: 'Your Details',
    blurb: 'So we can send the quote back and reference it against your records.',
    fields: ['customerCompany', 'customerName', 'customerEmail', 'customerPhone', 'customerReference'],
  },
  {
    id: 'review',
    label: 'Review',
    heading: 'Review & Submit',
    blurb: 'Check everything, then accept the freight terms to send your request.',
    fields: ['termsAccepted'],
  },
] as const

export const REVIEW_STEP_INDEX = WIZARD_STEPS.length - 1
