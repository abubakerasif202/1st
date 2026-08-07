// Copy that only exists in the printed Driver Handbook. Everything the handbook
// shares with the public site (roles, fleet, services, service areas, company
// profile) is read from its existing data module so the two cannot drift.

export const driverRequirements = [
  'Valid Australian driver licence',
  'The correct licence class for the role applied for',
  'Relevant heavy-vehicle driving experience, where required by the role',
  'A safe driving history',
  'Strong verbal and written communication skills',
  'Reliability and punctuality',
  'Ability to complete required transport and freight documentation',
  'Legal right to work in Australia',
  'Willingness to follow fatigue-management, safety and company procedures',
] as const

export const handbook = {
  eyebrow: 'Driver Handbook',
  title: 'Driving with 1st Class Express',
  intro: 'Standards, expectations and operating information for drivers working on 1st Class Express delivery, linehaul and fleet assignments.',
  badges: ['Established in 2013', 'Sydney & Interstate', 'Australian Privately Owned'],
  footerNote: '1st Class Express Pty Ltd — Driver Handbook',
  contents: [
    'About 1st Class Express',
    'Our commitment',
    'Driver standards',
    'Requirements and verification',
    'Roles and licence classes',
    'Vehicles you may be assigned',
    'Services you deliver',
    'Where we operate',
    'Work we support',
    'Performance and support',
    'Who to contact',
    'Acknowledgement',
  ],
  pullQuote: 'Depending on the customer’s requirements, drivers can be allocated to dedicated delivery runs and presented as an extension of the customer’s organisation. What a customer sees of us is, most days, what they see of you.',
  commitmentLead: 'Every driver contributes to the following:',
  standardsLead: 'The standards below apply across every assignment.',
  requirementsLead: 'Requirements vary by role. The items below are common expectations rather than a guarantee that every item applies to every position.',
  verificationNote: 'Police and background checks, driving-history and licence verification, and Australian working-rights verification are completed as part of onboarding.',
  rolesLead: 'Assignments are matched to licence class, experience and availability. The responsibilities listed for your role form the baseline of what is expected on every run.',
  fleetLead: 'Vehicle selection is matched to freight dimensions, weight, access and route. Availability is confirmed per booking.',
  servicesNote: 'Never accept, load or move freight outside the scope confirmed for your run. If something on the dock does not match the paperwork, contact dispatch before departing.',
  supportLead: 'Driver placements cover the following types of work. Your assignment may move between them as operational needs change.',
  performanceLead: 'Delivery runs are actively managed. The following sit behind every assignment, and are the mechanisms through which your work is reviewed and supported.',
  safetyNote: 'Operations follow fatigue-management, WHS and safe-driving procedures. Pre-trip and post-trip vehicle checks, load restraint and accurate trip documentation are not optional extras — they are part of every run, and they are what allow us to put a driver in front of a customer with confidence.',
  acknowledgement: 'I confirm that I have received and read the 1st Class Express Driver Handbook. I understand the driver standards, the requirements for my role, and my responsibility to follow fatigue-management, WHS, OHS and operational procedures on every assignment.',
  acknowledgementFields: ['Driver name', 'Licence class', 'Signature', 'Date', 'Issued by', 'Induction completed'],
  acknowledgementNote: 'Retain a copy of this page with your onboarding record. Requirements vary by role and assignment; items marked subject to availability or agreement are confirmed for each engagement.',
} as const
