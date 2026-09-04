// Maps the create_quote / quote_detail_json RPC result (snake_case DB rows) to
// the camelCase QuoteDetail the browser types expect.

import type {
  AuState,
  DeliveryAuthority,
  FreightItemRecord,
  QuoteDetail,
  QuoteStatus,
  ServicePriority,
} from '../../src/features/freightQuote/types.js'

interface QuoteRow {
  reference_number: string
  status: QuoteStatus
  created_at: string
  customer_company: string | null
  customer_name: string
  customer_email: string
  customer_phone: string
  preferred_contact_method: string | null
  customer_reference: string | null
  customer_notes: string | null
  pickup_address_line_1: string
  pickup_address_line_2: string | null
  pickup_suburb: string
  pickup_state: AuState
  pickup_postcode: string
  pickup_contact_name: string
  pickup_contact_phone: string
  pickup_date: string
  pickup_ready_time: string | null
  pickup_cutoff_time: string
  pickup_notes: string | null
  pickup_tailgate_required: boolean
  pickup_forklift_available: boolean
  pickup_loading_dock_available: boolean
  pickup_customer_loads: boolean
  delivery_address_line_1: string
  delivery_address_line_2: string | null
  delivery_suburb: string
  delivery_state: AuState
  delivery_postcode: string
  delivery_contact_name: string
  delivery_contact_phone: string
  requested_delivery_date: string | null
  delivery_cutoff_time: string
  delivery_notes: string | null
  delivery_tailgate_required: boolean
  delivery_forklift_available: boolean
  delivery_loading_dock_available: boolean
  delivery_receiver_unloads: boolean
  service_priority: ServicePriority
  service_specific_date: string | null
  delivery_authority: DeliveryAuthority
  atl_instructions: string | null
  total_items: number
  total_weight_kg: number | string
  total_volume_m3: number | string
  terms_version: string
  terms_accepted_at: string | null
  quoted_price: number | string | null
  quoted_price_gst: number | string | null
  quote_sent_at: string | null
  carrier_name: string | null
  carrier_consignment_number: string | null
  internal_notes: string | null
}

interface ItemRow {
  item_type: FreightItemRecord['itemType']
  description: string | null
  quantity: number
  length_cm: number | string
  width_cm: number | string
  height_cm: number | string
  weight_each_kg: number | string
  stackable: boolean
  dangerous_goods: boolean
  volume_m3: number | string
}

export interface QuoteDetailRpc {
  quote: QuoteRow
  items: ItemRow[]
  token: string
}

const num = (value: number | string | null | undefined): number =>
  value === null || value === undefined ? 0 : typeof value === 'number' ? value : Number(value)

const optNum = (value: number | string | null | undefined): number | null =>
  value === null || value === undefined ? null : num(value)

function item(row: ItemRow): FreightItemRecord {
  return {
    itemType: row.item_type,
    description: row.description ?? undefined,
    quantity: row.quantity,
    lengthCm: num(row.length_cm),
    widthCm: num(row.width_cm),
    heightCm: num(row.height_cm),
    weightEachKg: num(row.weight_each_kg),
    stackable: row.stackable,
    dangerousGoods: row.dangerous_goods,
    volumeM3: num(row.volume_m3),
  }
}

export interface SerializeOptions {
  /** quoted price + GST + sent-at. Safe to show the customer on the respond page. */
  includePricing?: boolean
  /** carrier + internal notes. Admin console only — never the customer. */
  includeInternal?: boolean
}

/** Public confirmation view — no money, no internal notes, unless opted in. */
export function toQuoteDetail(rpc: QuoteDetailRpc, opts: SerializeOptions = {}): QuoteDetail {
  const q = rpc.quote
  const contact = q.preferred_contact_method === 'phone' ? 'phone' : q.preferred_contact_method === 'email' ? 'email' : undefined

  const detail: QuoteDetail = {
    referenceNumber: q.reference_number,
    status: q.status,
    createdAt: q.created_at,
    customerCompany: q.customer_company ?? undefined,
    customerName: q.customer_name,
    customerEmail: q.customer_email,
    customerPhone: q.customer_phone,
    preferredContactMethod: contact,
    customerReference: q.customer_reference ?? undefined,
    pickup: {
      addressLine1: q.pickup_address_line_1,
      addressLine2: q.pickup_address_line_2 ?? undefined,
      suburb: q.pickup_suburb,
      state: q.pickup_state,
      postcode: q.pickup_postcode,
      contactName: q.pickup_contact_name,
      contactPhone: q.pickup_contact_phone,
      cutoffTime: q.pickup_cutoff_time,
      notes: q.pickup_notes ?? undefined,
      pickupDate: q.pickup_date,
      readyTime: q.pickup_ready_time ?? undefined,
      handling: {
        tailgateRequired: q.pickup_tailgate_required,
        forkliftAvailable: q.pickup_forklift_available,
        loadingDockAvailable: q.pickup_loading_dock_available,
        selfHandles: q.pickup_customer_loads,
      },
    },
    delivery: {
      addressLine1: q.delivery_address_line_1,
      addressLine2: q.delivery_address_line_2 ?? undefined,
      suburb: q.delivery_suburb,
      state: q.delivery_state,
      postcode: q.delivery_postcode,
      contactName: q.delivery_contact_name,
      contactPhone: q.delivery_contact_phone,
      cutoffTime: q.delivery_cutoff_time,
      notes: q.delivery_notes ?? undefined,
      requestedDeliveryDate: q.requested_delivery_date ?? undefined,
      handling: {
        tailgateRequired: q.delivery_tailgate_required,
        forkliftAvailable: q.delivery_forklift_available,
        loadingDockAvailable: q.delivery_loading_dock_available,
        selfHandles: q.delivery_receiver_unloads,
      },
    },
    servicePriority: q.service_priority,
    serviceSpecificDate: q.service_specific_date ?? undefined,
    deliveryAuthority: q.delivery_authority,
    atlInstructions: q.atl_instructions ?? undefined,
    items: rpc.items.map(item),
    totals: {
      totalItems: q.total_items,
      totalWeightKg: num(q.total_weight_kg),
      totalVolumeM3: num(q.total_volume_m3),
    },
    termsVersion: q.terms_version,
    termsAcceptedAt: q.terms_accepted_at ?? undefined,
  }

  if (opts.includePricing || opts.includeInternal) {
    detail.quotedPrice = optNum(q.quoted_price)
    detail.quotedPriceGst = optNum(q.quoted_price_gst)
    detail.quoteSentAt = q.quote_sent_at
  }
  if (opts.includeInternal) {
    detail.carrierName = q.carrier_name
    detail.carrierConsignmentNumber = q.carrier_consignment_number
    detail.internalNotes = q.internal_notes
  }

  return detail
}
