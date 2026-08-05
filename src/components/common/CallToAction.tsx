import { ButtonLink } from './ButtonLink'

export function CallToAction({ title = 'Freight support from pickup to delivery', text = 'Tell us what you are moving, where it is going and when it needs to arrive.' }: { title?: string; text?: string }) {
  return <section className="cta-band"><div className="container-page cta-inner"><div><p className="eyebrow">Ready when you are</p><h2>{title}</h2><p>{text}</p></div><ButtonLink to="/book-now">Get a Free Quote</ButtonLink></div></section>
}
