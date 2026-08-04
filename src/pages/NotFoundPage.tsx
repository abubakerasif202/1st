import { ButtonLink } from '../components/common/ButtonLink'
import { SeoHead } from '../components/common/SeoHead'

export default function NotFoundPage() { return <section className="not-found"><SeoHead title="Page Not Found | 1st Class Express" description="The requested page could not be found."/><img src="/brand/first-class-express-logo.png" alt="1st Class Express"/><p className="eyebrow">404 — Wrong turn</p><h1>This route does not go where you expected.</h1><p>Return to the homepage or request a freight quote.</p><div><ButtonLink to="/">Back to Home</ButtonLink><ButtonLink to="/book-now" variant="secondary">Get a Quote</ButtonLink></div></section> }
