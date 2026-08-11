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
