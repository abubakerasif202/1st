import { Box, PackageOpen, PanelsTopLeft, Truck } from 'lucide-react'

export const fleet = [
  { title: '1-tonne vans', use: 'Agile metropolitan and smaller freight movements.', icon: PackageOpen },
  { title: 'Courier vans', use: 'Responsive business and customer-facing deliveries.', icon: PackageOpen },
  { title: 'Pantech / box trucks', use: 'Protected transport for boxed and general freight.', icon: Box },
  { title: 'Pallet trucks', use: 'Palletised consignments and commercial deliveries.', icon: PanelsTopLeft },
  { title: 'Rigid trucks', use: 'Versatile fleet support for larger freight tasks.', icon: Truck },
  { title: 'Prime movers', use: 'Linehaul operations and major freight movements.', icon: Truck },
  { title: 'Mercedes-Benz Actros', use: 'A premium prime-mover option for assessed linehaul requirements.', icon: Truck },
  { title: 'Kenworth K220', use: 'A cab-over linehaul option for assessed high-capacity freight movements.', icon: Truck },
  { title: 'Semi-trailers', use: 'Interstate and large-scale freight requirements.', icon: Truck },
  { title: 'B-double capability', use: 'Assessed linehaul requirements where appropriate.', icon: Truck },
] as const
