// Regional landing pages under /service-areas/*. The locality lists mirror the
// groups shown on ServiceAreasPage so the two cannot drift apart; anything not
// already claimed there is not claimed here either.
export const serviceRegions = [
  {
    slug: 'sydney',
    title: 'Sydney Metropolitan Freight Services',
    eyebrow: 'Sydney Metropolitan',
    intro: 'Metropolitan freight delivery and courier work across Sydney, planned around access, timing and the freight itself.',
    image: '/images/replacement/delivery-fleet-sydney-branded.webp',
    localities: ['Sydney Metropolitan Area', 'Sydney CBD', 'Parramatta', 'Western Sydney', 'Northern Sydney', 'South Sydney'],
    notes: [
      'Same day, next day and scheduled metropolitan runs, subject to availability.',
      'Vans through to rigid trucks matched to load size, access and unloading conditions.',
      'After-hours and weekend movements arranged where agreed.',
    ],
  },
  {
    slug: 'nsw',
    title: 'Regional NSW Transport And Freight',
    eyebrow: 'Regional New South Wales',
    intro: 'Regional transport connecting the Central Coast, Hunter, Illawarra and western New South Wales with Sydney and interstate corridors.',
    image: '/images/replacement/fleet-lineup-yard-branded.webp',
    localities: ['Wollongong', 'Newcastle', 'Central Coast', 'Muswellbrook', 'Tamworth', 'Wagga Wagga', 'Narrandera', 'Griffith', 'Albury', 'Blue Mountains', 'Lithgow', 'Bathurst', 'Orange', 'Mudgee', 'Dubbo', 'Parkes'],
    notes: [
      'Regional runs planned around route, freight profile and delivery window.',
      'Rigid trucks, prime movers and trailer configurations selected per movement.',
      'Regional coverage is confirmed for the engagement before a job is booked.',
    ],
  },
] as const

export type ServiceRegion = (typeof serviceRegions)[number]
