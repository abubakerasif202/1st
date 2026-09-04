// Freight Terms & Conditions — structured content.
//
// IMPORTANT: 1st Class Express has not had a lawyer settle the contractual
// wording for this document. Sections that would create or limit legal rights
// (liability caps, insurance cover, warranty exclusions, dangerous-goods legal
// obligations, governing-law detail) are marked `legalReviewRequired` and render
// a visible "being finalised" notice instead of invented wording. Operational
// sections (what access we need, what information to give us, how charges are
// worked out) are written from how the business actually runs.
//
// Do not replace a `legalReviewRequired` body with confident legal text until a
// qualified adviser has approved it.

export const FREIGHT_TERMS_VERSION = '2026-09-01'
export const FREIGHT_TERMS_EFFECTIVE = '1 September 2026'

export interface TermsSection {
  id: string
  title: string
  /** Paragraphs of operational, non-fabricated content. */
  body: string[]
  /** When true, the page shows a "being finalised with our legal advisers" notice. */
  legalReviewRequired?: boolean
}

export const TERMS_SECTIONS: readonly TermsSection[] = [
  {
    id: 'definitions',
    title: '1. Definitions',
    body: [
      '“1st Class Express”, “we”, “us” and “our” mean 1st Class Express and any carrier we engage to perform the movement.',
      '“Customer”, “you” and “your” mean the person or business requesting the quote or booking the freight.',
      '“Freight” means the goods described in your quote request, including their packaging and pallets.',
      '“Quote” means the priced estimate we issue in response to a quote request. A quote is not a booking until we confirm it.',
    ],
  },
  {
    id: 'scope',
    title: '2. Scope',
    body: [
      'These terms apply to freight quotes requested through this website and to the transport services that follow from them.',
      'They sit alongside any separate credit-account agreement between you and 1st Class Express. Where a signed account agreement covers the same subject, that agreement prevails.',
    ],
  },
  {
    id: 'customer-information',
    title: '3. Customer Information',
    body: [
      'You are responsible for the accuracy of the information you give us: addresses, contact people, dates, access details, item counts, dimensions, weights and the nature of the goods.',
      'If the freight presented differs from what was quoted — more items, greater weight or volume, different dimensions, or goods requiring special handling — the price and vehicle allocation may change and delivery timing may be affected.',
    ],
  },
  {
    id: 'dimensions-weight',
    title: '4. Dimensions & Weight',
    body: [
      'Dimensions must be given in centimetres and weights in kilograms, per item, for the packaged freight as it will be presented.',
      'We calculate volume as length × width × height for each item, multiplied by quantity. Chargeable figures are confirmed on the quote and may be re-assessed if the freight as presented does not match the request.',
    ],
  },
  {
    id: 'pickup-access',
    title: '5. Pickup Access',
    body: [
      'You must ensure the pickup site is accessible to the vehicle type required, that someone is available to release the freight within the stated pickup window, and that the freight is ready and adequately packaged for transport.',
      'Tell us in the quote request about gate codes, site inductions, dock booking requirements, height or weight limits, and any equipment available on site.',
    ],
  },
  {
    id: 'delivery-access',
    title: '6. Delivery Access',
    body: [
      'You must ensure the delivery site is accessible to the vehicle type required and that someone is available to receive the freight within the stated delivery window, unless Authority to Leave has been given.',
      'Tell us about any booking system, restricted hours, or access limitations at the delivery site.',
    ],
  },
  {
    id: 'tailgate-forklift',
    title: '7. Tailgate & Forklift',
    body: [
      'If a tailgate truck is required, note it in the quote request. Tailgate loading and unloading is for freight within the tailgate’s safe working limits.',
      'If a forklift and operator are available on site to load or unload, telling us lets us plan the right vehicle. Where neither a forklift nor a loading dock is available and the freight is not hand-unloadable, a tailgate vehicle must be requested.',
    ],
  },
  {
    id: 'atl',
    title: '8. Authority to Leave',
    body: [
      'Authority to Leave (ATL) means our driver may leave the freight at the delivery address without obtaining a signature.',
      'If you select ATL you must provide clear instructions for where the freight can be left safely and out of view. Once the freight is left in accordance with your instructions, delivery is complete.',
    ],
    legalReviewRequired: true,
  },
  {
    id: 'signature-required',
    title: '9. Signature Required',
    body: [
      'If Signature Required is selected, our driver will obtain a signature from a person at the delivery address.',
      'If no one is available to sign within the delivery window, the freight may be returned to depot and a redelivery or storage charge may apply.',
    ],
  },
  {
    id: 'dangerous-goods',
    title: '10. Dangerous Goods',
    body: [
      'Dangerous goods must be declared in the quote request. We assess each dangerous-goods movement before accepting it and confirm the documentation, packaging, placarding and vehicle requirements that apply.',
      'Do not present undeclared dangerous goods for transport.',
    ],
    legalReviewRequired: true,
  },
  {
    id: 'delays',
    title: '11. Delays',
    body: [
      'We plan freight to the windows agreed on the quote. Timings are estimates and can be affected by weather, road conditions, mechanical issues, site delays and other events outside our control.',
      'Where a delay is likely to be material we will contact the nominated site contact.',
    ],
    legalReviewRequired: true,
  },
  {
    id: 'futile-pickup',
    title: '12. Futile Pickup',
    body: [
      'A futile pickup is a booked collection that cannot be completed because the freight is not ready, the site is inaccessible, no one is available to release the freight, or the freight differs materially from the request.',
      'A futile pickup fee may be charged to cover the vehicle and driver time.',
    ],
  },
  {
    id: 'futile-delivery',
    title: '13. Futile Delivery',
    body: [
      'A futile delivery is a delivery attempt that cannot be completed because the site is inaccessible, no one is available to receive or sign for the freight, or the delivery is refused.',
      'A futile delivery fee and subsequent redelivery or storage charges may apply.',
    ],
  },
  {
    id: 'redelivery',
    title: '14. Redelivery',
    body: [
      'Where a first delivery attempt is futile, redelivery is arranged for the next available run to that area. Redelivery is charged as an additional movement.',
    ],
  },
  {
    id: 'waiting-time',
    title: '15. Waiting Time',
    body: [
      'A reasonable free loading and unloading period applies at each site. Where a driver is held beyond that period, waiting time may be charged in increments after the free period ends.',
      'The free period and increment are confirmed on the quote.',
    ],
  },
  {
    id: 'subcontracted-carriers',
    title: '16. Subcontracted Carriers',
    body: [
      'We may perform all or part of a movement using subcontracted carriers. These terms apply whether the freight is carried by 1st Class Express directly or by a carrier we engage.',
    ],
    legalReviewRequired: true,
  },
  {
    id: 'charges',
    title: '17. Charges',
    body: [
      'Charges are set out on the quote and are based on the information provided in the quote request: route, service level, item count, weight, volume, access and handling requirements.',
      'Additional charges may apply for futile attempts, waiting time, redelivery, storage, manual handling not disclosed in the request, dangerous-goods handling, and freight that differs materially from the request.',
      'All charges are in Australian dollars and exclusive of GST unless stated otherwise.',
    ],
  },
  {
    id: 'payment',
    title: '18. Payment',
    body: [
      'Unless you hold an approved credit account with 1st Class Express, freight is payable before or on delivery.',
      'Credit terms are only available where a customer application has been submitted and approved in writing. Requested terms on an application are a request only and are not in effect until approved.',
    ],
  },
  {
    id: 'cancellation',
    title: '19. Cancellation',
    body: [
      'You may cancel a booked movement by contacting our operations team. A cancellation made after a vehicle has been dispatched or committed to your freight may incur a charge for the vehicle and driver time.',
    ],
  },
  {
    id: 'claims-damage',
    title: '20. Claims & Damage',
    body: [
      'Any loss or damage should be noted on the delivery documentation at the time of delivery and reported to our operations team as soon as possible.',
      'The process for making a claim, the information required, and any time limits will be set out in this section once the wording has been finalised.',
    ],
    legalReviewRequired: true,
  },
  {
    id: 'insurance',
    title: '21. Insurance',
    body: [
      'Transit insurance arrangements and the extent of any cover for freight in our care will be set out in this section once the wording has been finalised.',
      'If your freight requires specific insurance cover, raise this with our operations team before booking so it can be arranged separately.',
    ],
    legalReviewRequired: true,
  },
  {
    id: 'privacy',
    title: '22. Privacy',
    body: [
      'We collect the information in your quote request to prepare a quote, arrange transport, and contact you about the movement. We share it with carriers we engage only as needed to perform the movement.',
      'We do not sell your information. You can ask us what information we hold about you and ask us to correct it by contacting our operations team.',
    ],
  },
  {
    id: 'governing-law',
    title: '23. Governing Law',
    body: [
      'These terms are governed by the law of New South Wales, Australia.',
      'The detail of jurisdiction and dispute resolution will be confirmed in this section once the wording has been finalised.',
    ],
    legalReviewRequired: true,
  },
  {
    id: 'acceptance',
    title: '24. Acceptance',
    body: [
      'By submitting a freight quote request and ticking the acceptance box, you confirm that you have read these terms and that the information you have provided is accurate.',
      'We record the version of these terms shown to you and the time you accepted them.',
    ],
  },
] as const

export const LEGAL_REVIEW_NOTICE =
  'This section is being finalised with our legal advisers and will be published in full before it takes contractual effect. The summary above describes how the business operates in practice.'
