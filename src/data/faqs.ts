import { company } from './company'

// Answers are drawn from the operating detail already published elsewhere on the
// site (services, fleet, service areas) so the FAQ cannot contradict it. Keep
// them factual — this content is also emitted as FAQPage structured data, and
// schema that overstates capability is a liability, not a ranking win.
export const serviceFaqs = [
  {
    question: 'Which areas does 1st Class Express deliver to?',
    answer: `We cover the Sydney metropolitan area and regional NSW, including ${company.serviceAreas.slice(2, 8).join(', ')} and the Central Coast, plus interstate linehaul between Sydney, Brisbane, Melbourne, Adelaide and Perth.`,
  },
  {
    question: 'Do you offer same-day and next-day delivery?',
    answer: 'Yes. Same-day and next-day transport is available for time-sensitive freight across metropolitan and regional routes. Pickup and delivery timing is confirmed after the route, site access and freight details are assessed.',
  },
  {
    question: 'Can you transport dangerous goods?',
    answer: 'We provide assessed transport support for classified freight. Acceptance is subject to freight classification, correct documentation, compliant equipment and qualified personnel, so dangerous-goods movements are always reviewed before they are booked.',
  },
  {
    question: 'What vehicles are available?',
    answer: 'The fleet runs from 1-tonne vans and pallet trucks for metropolitan parcels and pallets, through rigid trucks for multi-drop work, to prime movers, semi-trailers and B-double configurations for interstate linehaul. Vehicle selection is matched to freight dimensions, weight, access and route.',
  },
  {
    question: 'Can you supply drivers rather than a full transport service?',
    answer: 'Yes. We place professional drivers for leave coverage, demand peaks and ongoing dedicated runs, including drivers presented in client-approved uniforms. Placements are confirmed by licence class, experience and availability.',
  },
  {
    question: 'Do you handle after-hours or weekend freight?',
    answer: 'Movements outside standard business hours can be arranged around your operating window, including day and night operations and weekend work. After-hours transport is subject to route, driver and vehicle availability.',
  },
  {
    question: 'How do I get a freight quote?',
    answer: `Submit the quote form with the pickup and delivery locations, timing and freight details, or call ${company.phonePrimary}. We assess the freight and respond with a transport plan and pricing.`,
  },
] as const
