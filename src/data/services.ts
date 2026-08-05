import { Boxes, CalendarClock, Clock3, Container, Home, Route, ShieldCheck, Truck, UserRoundCheck } from 'lucide-react'

export const services = [
  { title: 'Sydney Metropolitan Deliveries', short: 'Professional business delivery support across Sydney metropolitan areas.', detail: 'For regular customer runs, warehouse-to-customer deliveries and scheduled metropolitan freight.', icon: Route },
  { title: 'Same Day / Next Day', short: 'Responsive delivery options matched to your freight, destination and urgency.', detail: 'For time-sensitive consignments that need a practical same-day or next-day transport plan.', icon: Clock3 },
  { title: 'After Hours & Weekend', short: 'Flexible transport support beyond standard business hours, arranged in advance.', detail: 'For planned work, urgent freight and operational windows that fall outside the usual workday.', icon: CalendarClock },
  { title: 'Bulk Freight', short: 'Coordinated movement of larger freight across local and interstate routes.', detail: 'For businesses consolidating substantial consignments or recurring freight movements.', icon: Boxes },
  { title: 'Parcels, Cartons & Pallets', short: 'Planned handling for everyday commercial freight from individual parcels to palletised consignments.', detail: 'For freight requiring the right vehicle, collection plan and delivery handling.', icon: Container },
  { title: 'Fragile Freight', short: 'Careful transport planning for goods that need considerate handling through transit.', detail: 'For fragile items where handling requirements are confirmed before the run is accepted.', icon: ShieldCheck },
  { title: 'Back-Up Drivers', short: 'Experienced driver support when your regular transport resources are unavailable.', detail: 'For leave coverage, demand peaks and short-term operational continuity.', icon: UserRoundCheck },
  { title: 'Warehouse & Dispatch Support', short: 'Driver support for warehouse, dispatch and customer delivery operations.', detail: 'For businesses requiring an experienced extra pair of hands across the delivery workflow.', icon: Boxes },
  { title: 'Home Deliveries', short: 'Customer-facing delivery support handled with care and clear communication.', detail: 'For freight that needs to reach residential customers professionally.', icon: Home },
  { title: 'Logistics Support', short: 'Practical transport coordination for changing schedules and delivery requirements.', detail: 'For organisations needing dependable support across the delivery chain.', icon: Route },
  { title: 'Dangerous Goods Support', short: 'Support with necessary operational requirements and insurance, subject to job assessment.', detail: 'Every request is assessed before acceptance to confirm operational suitability.', icon: ShieldCheck },
  { title: 'Local, Linehaul & Interstate', short: 'Transport support from metropolitan work through to interstate freight routes.', detail: 'For freight moving within a city, across regions or between Australian capitals.', icon: Truck },
  { title: 'Dedicated Driver Services', short: 'Drivers can represent your business on regular customer-facing runs by agreement.', detail: 'For organisations requiring a dedicated driver, approved presentation and consistent delivery support.', icon: UserRoundCheck },
] as const
