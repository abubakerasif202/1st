export const company = {
  name: '1st Class Express',
  tagline: 'Committed to Deliver a Quality Service',
  email: 'enquiry@1stclassexpress.com.au',
  phonePrimary: '0431 604 240',
  contactName: 'Dino / Divine',
  contactRole: 'Operations Manager',
  ownership: 'Australian privately owned',
  cities: ['Sydney', 'Brisbane', 'Melbourne', 'Adelaide'],
  interstate: ['Sydney, NSW', 'Brisbane, QLD', 'Melbourne, VIC', 'Adelaide, SA', 'Perth, WA'],
  serviceAreas: ['Sydney Metropolitan Area', 'Sydney CBD', 'Wollongong', 'Canberra', 'Wagga Wagga', 'Narrandera', 'Griffith', 'Albury', 'Blue Mountains', 'Lithgow', 'Bathurst', 'Orange', 'Mudgee', 'Dubbo', 'Parkes', 'Central Coast', 'Newcastle', 'Muswellbrook', 'Tamworth'],
} as const

export const phoneHref = (phone: string) => `tel:${phone.replace(/\s/g, '')}`
