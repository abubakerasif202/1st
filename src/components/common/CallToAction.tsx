import { ButtonLink } from './ButtonLink'

export function CallToAction({ title = 'A–Z Great Peace of Mind', text = 'No worries, no hassles — delivery at your doorstep.' }: { title?: string; text?: string }) {
  return <section className="cta-band"><div className="container-page cta-inner"><div><p className="eyebrow">Ready when you are</p><h2>{title}</h2><p>{text}</p></div><ButtonLink to="/book-now">Get a Free Quote</ButtonLink></div></section>
}
