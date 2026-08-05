import { ButtonLink } from '../components/common/ButtonLink'
import { SeoHead } from '../components/common/SeoHead'
import routeSeo from '../data/routeSeo.json'
import { useLocation } from 'react-router-dom'

export default function NotFoundPage() { const { pathname } = useLocation(); return <section className="not-found"><SeoHead {...routeSeo.notFound} path={pathname} noIndex/><img src="/brand/first-class-express-logo.png" alt="1st Class Express"/><p className="eyebrow">404 — Wrong turn</p><h1>This route does not go where you expected.</h1><p>Return to the homepage or request a freight quote.</p><div><ButtonLink to="/">Back to Home</ButtonLink><ButtonLink to="/book-now" variant="secondary">Get a Quote</ButtonLink></div></section> }
