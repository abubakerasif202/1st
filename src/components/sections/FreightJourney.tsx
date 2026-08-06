const journeySteps = [
  { title: 'Quote Request', text: 'Send through the freight details, pickup and delivery locations, and preferred timing.' },
  { title: 'Freight Assessment', text: 'We review the route, freight profile, access requirements and the right vehicle for the job.' },
  { title: 'Collection Planning', text: 'Pickup is scheduled and confirmed, with any specific loading or site requirements noted.' },
  { title: 'Secure Loading', text: 'Freight is loaded and secured for the road, following safe handling procedures.' },
  { title: 'Interstate Transport', text: 'Your freight moves on the confirmed route, with progress kept visible through to arrival.' },
  { title: 'Delivery Confirmation', text: 'Delivery is completed and confirmed, closing out the job.' },
] as const

export function FreightJourney() {
  return <ol className="freight-journey">
    {journeySteps.map((step, index) => <li key={step.title} className="freight-journey__stage">
      <span className="freight-journey__marker">{String(index + 1).padStart(2, '0')}</span>
      <h3>{step.title}</h3>
      <p>{step.text}</p>
    </li>)}
  </ol>
}
