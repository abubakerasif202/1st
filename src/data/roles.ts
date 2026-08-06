export type RoleStatus = 'open' | 'closed' | 'eoi'

export type DriverRole = {
  id: string
  title: string
  employmentType: string
  location: string
  licenceClass: string
  experience: string
  responsibilities: readonly string[]
  status: RoleStatus
}

// Roles ship as "eoi" (expressions of interest) by default. Only flip a role to
// "open" once a specific vacancy is genuinely confirmed — CareersPage only emits
// JobPosting structured data for roles marked "open".
export const driverRoles: readonly DriverRole[] = [
  {
    id: 'interstate-hv-driver',
    title: 'Interstate Heavy Vehicle Driver',
    employmentType: 'Full-time / Casual',
    location: 'Sydney-based, interstate linehaul routes',
    licenceClass: 'HC or MC',
    experience: 'Recent interstate or linehaul driving experience preferred',
    responsibilities: ['Interstate linehaul freight movements', 'Pre-trip and post-trip vehicle checks', 'Accurate freight and trip documentation', 'Compliance with fatigue-management requirements'],
    status: 'eoi',
  },
  {
    id: 'local-delivery-driver',
    title: 'Local Delivery Driver',
    employmentType: 'Full-time / Part-time',
    location: 'Sydney metropolitan area',
    licenceClass: 'Car licence or LR, depending on vehicle',
    experience: 'Local delivery or courier driving experience preferred',
    responsibilities: ['Metropolitan pickup and delivery runs', 'Customer-facing delivery service', 'Proof-of-delivery and freight documentation', 'Safe loading and unloading of freight'],
    status: 'eoi',
  },
  {
    id: 'hc-driver',
    title: 'HC Driver',
    employmentType: 'Full-time / Casual',
    location: 'Sydney and regional NSW routes',
    licenceClass: 'HC',
    experience: 'Demonstrated HC driving experience',
    responsibilities: ['Rigid and semi-trailer freight movements', 'Route and scheduling adherence', 'Vehicle safety checks', 'Safe handling of palletised and bulk freight'],
    status: 'eoi',
  },
  {
    id: 'mc-driver',
    title: 'MC Driver',
    employmentType: 'Full-time / Casual',
    location: 'Interstate linehaul corridors',
    licenceClass: 'MC',
    experience: 'B-double or road-train experience highly regarded',
    responsibilities: ['B-double and combination-vehicle freight movements', 'Interstate route and fatigue-management compliance', 'Load-restraint and safety checks', 'Accurate trip and freight documentation'],
    status: 'eoi',
  },
  {
    id: 'hr-driver',
    title: 'HR Driver',
    employmentType: 'Full-time / Part-time / Casual',
    location: 'Sydney metropolitan and regional NSW',
    licenceClass: 'HR',
    experience: 'Rigid-truck driving experience preferred',
    responsibilities: ['Rigid-vehicle freight and delivery runs', 'Warehouse loading and dispatch support', 'Customer-facing delivery service', 'Vehicle safety and maintenance checks'],
    status: 'eoi',
  },
  {
    id: 'relief-casual-driver',
    title: 'Relief or Casual Driver',
    employmentType: 'Casual',
    location: 'Sydney metropolitan, with regional and interstate work as required',
    licenceClass: 'Car licence through to MC, depending on assignment',
    experience: 'Reliable availability and the relevant licence class for the assigned vehicle',
    responsibilities: ['Backup coverage for leave and peak-demand periods', 'Assignment to local, regional or interstate runs as required', 'Compliance with the same safety and documentation standards as permanent drivers'],
    status: 'eoi',
  },
] as const
