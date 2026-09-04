// Validated customer-application payload -> snake_case shape for the
// create_customer_application RPC.

import type { CustomerApplicationValues } from '../../src/features/customerApplication/schema'

const orNull = (value: string | undefined): string | null =>
  value && value.trim() !== '' ? value.trim() : null

export function normaliseApplication(
  form: CustomerApplicationValues,
  opts: { idempotencyKey: string; termsVersion: string; quoteId?: string | null },
): Record<string, unknown> {
  return {
    idempotency_key: opts.idempotencyKey,
    terms_version: opts.termsVersion,
    quote_id: opts.quoteId ?? null,

    legal_business_name: form.legalBusinessName,
    trading_name: orNull(form.tradingName),
    abn: form.abn,
    acn: orNull(form.acn),

    business_address: form.businessAddress,
    suburb: form.suburb,
    state: form.state,
    postcode: form.postcode,

    primary_contact_name: form.primaryContactName,
    primary_contact_position: orNull(form.primaryContactPosition),
    primary_contact_email: form.primaryContactEmail,
    primary_contact_phone: form.primaryContactPhone,

    accounts_contact_name: orNull(form.accountsContactName),
    accounts_contact_email: orNull(form.accountsContactEmail),
    accounts_contact_phone: orNull(form.accountsContactPhone),

    operating_open_time: orNull(form.operatingOpenTime),
    operating_close_time: orNull(form.operatingCloseTime),
    saturday_hours: orNull(form.saturdayHours),
    sunday_hours: orNull(form.sundayHours),
    pickup_cutoff_time: orNull(form.pickupCutoffTime),
    delivery_cutoff_time: orNull(form.deliveryCutoffTime),

    site_forklift_available: form.siteForkliftAvailable,
    site_loading_dock_available: form.siteLoadingDockAvailable,
    site_tailgate_required: form.siteTailgateRequired,
    site_special_instructions: orNull(form.siteSpecialInstructions),

    payment_method_requested: form.paymentMethodRequested,
    payment_terms_requested: form.paymentTermsRequested,

    authorised_signatory_name: form.authorisedSignatoryName,
    authorised_signatory_position: form.authorisedSignatoryPosition,
    authorised_signatory_email: form.authorisedSignatoryEmail,
    authorised_signatory_phone: form.authorisedSignatoryPhone,
    typed_signature: form.typedSignature,
    signature_date: form.signatureDate,
  }
}
