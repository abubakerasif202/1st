// Domain types for the freight quote system. These mirror the database schema
// in supabase/migrations/0001_freight_quote_system.sql. The wizard, the API
// route and the confirmation page all speak these shapes.

export const AU_STATES = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'] as const
export type AuState = (typeof AU_STATES)[number]

export const FREIGHT_ITEM_TYPES = [
  'pallet',
  'box',
  'carton',
  'crate',
  'skid',
  'machinery',
  'other',
] as const
export type FreightItemType = (typeof FREIGHT_ITEM_TYPES)[number]

export const SERVICE_PRIORITIES = [
  'urgent',
  'next_business_day',
  'three_to_five_days',
  'specific_date',
] as const
export type ServicePriority = (typeof SERVICE_PRIORITIES)[number]

export const DELIVERY_AUTHORITIES = ['atl', 'signature_required'] as const
export type DeliveryAuthority = (typeof DELIVERY_AUTHORITIES)[number]

export const QUOTE_STATUSES = [
  'new',
  'reviewing',
  'quoted',
  'accepted',
  'booked',
  'in_transit',
  'delivered',
  'on_hold',
  'declined',
  'cancelled',
] as const
export type QuoteStatus = (typeof QUOTE_STATUSES)[number]

/** A single line on the freight manifest. Dimensions are in centimetres. */
export interface FreightItemInput {
  itemType: FreightItemType
  description?: string
  quantity: number
  lengthCm: number
  widthCm: number
  heightCm: number
  weightEachKg: number
  stackable: boolean
  dangerousGoods: boolean
}

/** Server-computed totals. The browser never supplies these. */
export interface QuoteTotals {
  totalItems: number
  totalWeightKg: number
  totalVolumeM3: number
}

export interface QuoteTotalsWithLines extends QuoteTotals {
  lineVolumesM3: number[]
}

export interface FreightItemRecord extends FreightItemInput {
  volumeM3: number
}

/** Handling flags for one end of the journey. */
export interface HandlingFlags {
  tailgateRequired: boolean
  forkliftAvailable: boolean
  loadingDockAvailable: boolean
  /** Pickup: customer loads. Delivery: receiver unloads. */
  selfHandles: boolean
}

export interface LocationDetail {
  addressLine1: string
  addressLine2?: string
  suburb: string
  state: AuState
  postcode: string
  contactName: string
  contactPhone: string
  cutoffTime: string
  notes?: string
  handling: HandlingFlags
}

/**
 * Full quote record returned by the API. Used by the confirmation page, the
 * secure customer response page and the admin detail view. Money and internal
 * fields are only populated for the admin-authenticated response.
 */
export interface QuoteDetail {
  referenceNumber: string
  status: QuoteStatus
  createdAt: string

  customerCompany?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  preferredContactMethod?: 'email' | 'phone'
  customerReference?: string

  pickup: LocationDetail & { pickupDate: string; readyTime?: string }
  delivery: LocationDetail & { requestedDeliveryDate?: string }

  servicePriority: ServicePriority
  serviceSpecificDate?: string
  deliveryAuthority: DeliveryAuthority
  atlInstructions?: string

  items: FreightItemRecord[]
  totals: QuoteTotals

  termsVersion: string
  termsAcceptedAt?: string

  /** Admin / accepted-quote only. */
  quotedPrice?: number | null
  quotedPriceGst?: number | null
  quoteSentAt?: string | null
  carrierName?: string | null
  carrierConsignmentNumber?: string | null
  internalNotes?: string | null
}

/** Alias kept for the confirmation-page call site. */
export type QuoteConfirmation = QuoteDetail
