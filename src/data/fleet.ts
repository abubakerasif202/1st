import { Box, PackageOpen, PanelsTopLeft, Truck } from 'lucide-react'

export const fleet = [
  { title: 'Vans', use: 'Agile metropolitan, parcel and smaller freight movements.', icon: PackageOpen },
  { title: 'Light trucks', use: 'Business deliveries and general freight where a larger vehicle is required.', icon: Box },
  { title: 'Rigid trucks', use: 'Versatile fleet support for pallets, bulk freight and larger delivery tasks.', icon: Truck },
  { title: 'Curtain-side vehicles', use: 'Commercial freight movements requiring practical side access.', icon: PanelsTopLeft },
  { title: 'Heavy vehicles', use: 'Assessed transport support for substantial freight and linehaul work.', icon: Truck },
  { title: 'Mercedes-Benz Actros', use: 'A late-model prime-mover option for assessed interstate linehaul requirements.', icon: Truck },
  { title: 'Kenworth K220', use: 'A cab-over linehaul option for assessed B-double freight movements.', icon: Truck },
  { title: 'Interstate linehaul trucks', use: 'Freight movements between metropolitan, regional and interstate locations.', icon: Truck },
  { title: 'Dedicated client vehicles', use: 'Vehicle allocation structured around a regular customer run, by agreement and availability.', icon: Truck },
] as const
