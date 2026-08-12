// Interstate linehaul corridors that have their own indexable detail page.
// Kept in src/data (rather than inside the page component) so ServiceAreasPage
// can link to them and the route tests can assert the set without importing a
// page module.
export const interstateRoutes = [
  {
    slug: 'sydney-melbourne',
    title: 'Sydney to Melbourne Freight Linehaul',
    origin: 'Sydney, NSW',
    destination: 'Melbourne, VIC',
    transit: 'Overnight / next-day, confirmed per movement',
    description: 'Linehaul freight movements on the Sydney to Melbourne corridor for palletised, bulk and B-double freight. Departure and delivery windows are confirmed for each booking.',
  },
  {
    slug: 'sydney-brisbane',
    title: 'Sydney to Brisbane Freight Linehaul',
    origin: 'Sydney, NSW',
    destination: 'Brisbane, QLD',
    transit: 'Typically 24–36 hours, subject to route and load',
    description: 'Interstate linehaul between Sydney and Brisbane covering commercial freight, regional drops and manufacturing runs. Timing is confirmed after the route and freight profile are assessed.',
  },
  {
    slug: 'sydney-canberra',
    title: 'Sydney to Canberra Freight Linehaul',
    origin: 'Sydney, NSW',
    destination: 'Canberra, ACT',
    transit: 'Same-day or overnight, subject to availability',
    description: 'Freight and driver services connecting Sydney and Canberra for commercial consignments and express cargo. Vehicle and timing are matched to the freight and access requirements.',
  },
] as const

export type InterstateRoute = (typeof interstateRoutes)[number]

// These are the interstate destinations supported by the verified company data.
// Corridor pages only exist for the three routes above; Adelaide and Perth are
// assessed per movement, so the UI must not imply a fixed schedule for them.
export const interstateCoverage = [
  { name: 'Canberra', label: 'Canberra, ACT', type: 'Regional and interstate', description: 'Freight and driver services connecting Sydney and Canberra, with timing and vehicle requirements confirmed for each movement.' },
  { name: 'Melbourne', label: 'Melbourne, VIC', type: 'Interstate corridor', description: 'Planned linehaul freight between Sydney and Melbourne, with the route, timing and vehicle confirmed for each booking.' },
  { name: 'Adelaide', label: 'Adelaide, SA', type: 'Interstate by assessment', description: 'Adelaide freight is assessed per movement, subject to the route, freight profile, timing and vehicle availability.' },
  { name: 'Brisbane', label: 'Brisbane, QLD', type: 'Interstate corridor', description: 'Planned linehaul freight between Sydney and Brisbane, with the route, timing and vehicle confirmed for each booking.' },
  { name: 'Perth', label: 'Perth, WA', type: 'Interstate by assessment', description: 'Perth freight is assessed per movement, subject to the route, freight profile, timing and vehicle availability.' },
] as const
