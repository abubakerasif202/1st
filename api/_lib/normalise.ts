// Turns a validated wizard payload into the snake_case shape the create_quote
// RPC expects. Totals and per-line volume are computed here (server-side),
// never taken from the request body.

import { lineVolumeM3, summariseTotals } from '../../src/features/freightQuote/calculations'
import type { QuoteFormValues } from '../../src/features/freightQuote/schema'
import type { FreightItemInput } from '../../src/features/freightQuote/types'

export interface NormalisedQuote {
  quote: Record<string, unknown>
  items: Array<Record<string, unknown>>
}

export function normaliseQuote(
  form: QuoteFormValues,
  opts: { idempotencyKey: string; termsVersion: string },
): NormalisedQuote {
  const items: FreightItemInput[] = form.items.map((item) => ({
    itemType: item.itemType,
    description: item.description,
    quantity: item.quantity,
    lengthCm: item.lengthCm,
    widthCm: item.widthCm,
    heightCm: item.heightCm,
    weightEachKg: item.weightEachKg,
    stackable: item.stackable,
    dangerousGoods: item.dangerousGoods,
  }))
  const totals = summariseTotals(items)

  return {
    quote: {
      idempotency_key: opts.idempotencyKey,
      terms_version: opts.termsVersion,

      customer_company: form.customerCompany ?? null,
      customer_name: form.customerName,
      customer_email: form.customerEmail,
      customer_phone: form.customerPhone,
      preferred_contact_method: form.preferredContactMethod ?? null,
      customer_reference: form.customerReference ?? null,
      customer_notes: form.customerNotes ?? null,

      pickup_address_line_1: form.pickupAddressLine1,
      pickup_address_line_2: form.pickupAddressLine2 ?? null,
      pickup_suburb: form.pickupSuburb,
      pickup_state: form.pickupState,
      pickup_postcode: form.pickupPostcode,
      pickup_contact_name: form.pickupContactName,
      pickup_contact_phone: form.pickupContactPhone,
      pickup_date: form.pickupDate,
      pickup_ready_time: form.pickupReadyTime || null,
      pickup_cutoff_time: form.pickupCutoffTime,
      pickup_notes: form.pickupNotes ?? null,

      delivery_address_line_1: form.deliveryAddressLine1,
      delivery_address_line_2: form.deliveryAddressLine2 ?? null,
      delivery_suburb: form.deliverySuburb,
      delivery_state: form.deliveryState,
      delivery_postcode: form.deliveryPostcode,
      delivery_contact_name: form.deliveryContactName,
      delivery_contact_phone: form.deliveryContactPhone,
      requested_delivery_date: form.requestedDeliveryDate || null,
      delivery_cutoff_time: form.deliveryCutoffTime,
      delivery_notes: form.deliveryNotes ?? null,

      pickup_tailgate_required: form.pickupTailgateRequired,
      pickup_forklift_available: form.pickupForkliftAvailable,
      pickup_loading_dock_available: form.pickupLoadingDockAvailable,
      pickup_customer_loads: form.pickupCustomerLoads,
      delivery_tailgate_required: form.deliveryTailgateRequired,
      delivery_forklift_available: form.deliveryForkliftAvailable,
      delivery_loading_dock_available: form.deliveryLoadingDockAvailable,
      delivery_receiver_unloads: form.deliveryReceiverUnloads,

      service_priority: form.servicePriority,
      service_specific_date: form.serviceSpecificDate || null,
      delivery_authority: form.deliveryAuthority,
      atl_instructions: form.atlInstructions ?? null,

      total_items: totals.totalItems,
      total_weight_kg: totals.totalWeightKg,
      total_volume_m3: totals.totalVolumeM3,
    },
    items: items.map((item) => ({
      item_type: item.itemType,
      description: item.description ?? null,
      quantity: item.quantity,
      length_cm: item.lengthCm,
      width_cm: item.widthCm,
      height_cm: item.heightCm,
      weight_each_kg: item.weightEachKg,
      stackable: item.stackable,
      dangerous_goods: item.dangerousGoods,
      volume_m3: lineVolumeM3(item),
    })),
  }
}
