import { ArrowRight, MapPinned, Phone, Route, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/common/PageHero'
import { RouteExplorer } from '../components/sections/RouteExplorer'
import { SeoHead } from '../components/common/SeoHead'
import { company, phoneHref } from '../data/company'
import { interstateCoverage, interstateRoutes } from '../data/interstateRoutes'
import { serviceRegions } from '../data/serviceRegions'
import routeSeo from '../data/routeSeo.json'

interface RouteGroup {
  title: string
  items: readonly string[]
}

const groups: readonly RouteGroup[] = [
  { title: 'Sydney & Metropolitan', items: ['Sydney Metropolitan Area','Sydney CBD','Parramatta','Western Sydney','Northern Sydney','South Sydney'] },
  { title: 'Greater New South Wales', items: ['Wollongong','Wagga Wagga','Narrandera','Griffith','Albury','Blue Mountains','Lithgow','Bathurst','Orange','Mudgee','Dubbo','Parkes'] },
  { title: 'Central Coast & Hunter', items: ['Central Coast','Newcastle','Muswellbrook','Tamworth'] },
  { title: 'Interstate Linehaul', items: interstateCoverage.map(({ label, type }) => type === 'Interstate by assessment' ? `${label} — subject to route review` : label) },
]

export default function ServiceAreasPage(){
  const [searchTerm, setSearchTerm] = useState('')
  const normalizedQuery = searchTerm.trim().toLowerCase()

  const filteredRegions = useMemo(() => {
    if (!normalizedQuery) return serviceRegions
    return serviceRegions.filter(r =>
      r.title.toLowerCase().includes(normalizedQuery) ||
      r.eyebrow.toLowerCase().includes(normalizedQuery) ||
      r.intro.toLowerCase().includes(normalizedQuery) ||
      r.localities.some(loc => loc.toLowerCase().includes(normalizedQuery))
    )
  }, [normalizedQuery])

  const filteredRoutes = useMemo(() => {
    if (!normalizedQuery) return interstateRoutes
    return interstateRoutes.filter(r =>
      r.title.toLowerCase().includes(normalizedQuery) ||
      r.origin.toLowerCase().includes(normalizedQuery) ||
      r.destination.toLowerCase().includes(normalizedQuery) ||
      r.description.toLowerCase().includes(normalizedQuery)
    )
  }, [normalizedQuery])

  const filteredGroups = useMemo(() => {
    if (!normalizedQuery) return groups
    return groups
      .map(({ title, items }) => ({
        title,
        items: items.filter(item => item.toLowerCase().includes(normalizedQuery)),
      }))
      .filter(group => group.items.length > 0)
  }, [normalizedQuery])

  return <>
    <SeoHead {...routeSeo.serviceAreas}/>
    <PageHero eyebrow="Service Areas" title="Metropolitan, Regional And Interstate" intro="Local knowledge across Sydney and New South Wales, backed by planned interstate freight services assessed around the route, timing and vehicle requirements." image="/images/replacement/prime-mover-hero-branded.webp"/>

    <section className="lovable-section lovable-section--soft">
      <div className="container-page">
        <div className="area-search-container">
          <label htmlFor="area-search" className="area-search-label">
            <Search size={18} aria-hidden="true" />
            <span>Search coverage destinations &amp; corridors</span>
          </label>
          <input
            id="area-search"
            type="search"
            className="area-search-input"
            placeholder="Type a city, suburb or corridor (e.g. Newcastle, Dubbo, Melbourne, Sydney CBD)…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="area-search-clear"
              onClick={() => setSearchTerm('')}
              aria-label="Clear destination search"
            >
              Clear
            </button>
          )}
        </div>
        <p className="sr-only" role="status">
          {normalizedQuery
            ? `${filteredRegions.length + filteredRoutes.length} area guides and corridors match ${searchTerm}.`
            : ''}
        </p>

        <div className="lovable-heading">
          <p className="lovable-kicker">Coverage</p>
          <h2>Routes We Run</h2>
          <p>Availability is confirmed after reviewing freight type, access, timing and vehicle requirements.</p>
        </div>
        <div className="lovable-route-grid">
          {filteredGroups.map(({ title, items }) => (
            <article className="lovable-route-card" key={title}>
              <MapPinned aria-hidden="true"/>
              <h3>{title}</h3>
              <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
          {filteredGroups.length === 0 && (
            <p className="area-search-empty">No direct hubs match "{searchTerm}". Check our corridor guides below or request a custom route quote.</p>
          )}
        </div>
      </div>
    </section>

    <section className="lovable-section">
      <div className="container-page">
        <div className="lovable-heading">
          <p className="lovable-kicker">Area Guides</p>
          <h2>Coverage In Detail</h2>
          <p>Region and corridor pages covering where we deliver and how those movements are planned.</p>
        </div>
        <div className="lovable-feature-grid">
          {filteredRegions.map(region => (
            <article className="lovable-feature" key={region.slug}>
              <MapPinned aria-hidden="true"/>
              <h3>{region.eyebrow}</h3>
              <p>{region.intro}</p>
              <Link className="fleet-card-link" to={`/service-areas/${region.slug}`}>View coverage <ArrowRight size={15} aria-hidden="true"/></Link>
            </article>
          ))}
          {filteredRoutes.map(route => (
            <article className="lovable-feature" key={route.slug}>
              <Route aria-hidden="true"/>
              <h3>{route.title}</h3>
              <p>{route.description}</p>
              <Link className="fleet-card-link" to={`/service-areas/interstate/${route.slug}`}>View corridor <ArrowRight size={15} aria-hidden="true"/></Link>
            </article>
          ))}
          {filteredRegions.length === 0 && filteredRoutes.length === 0 && (
            <p className="area-search-empty">No area guide or corridor page matches &ldquo;{searchTerm}&rdquo;. Request a quote and we will confirm whether we cover that route.</p>
          )}
        </div>
      </div>
    </section>

    <section className="lovable-section lovable-section--dark">
      <div className="container-page">
        <div className="lovable-heading">
          <p className="lovable-kicker">Our Network</p>
          <h2>Australia-Wide Interstate Transport</h2>
          <p>1st Class Express supports planned interstate freight from Sydney to Canberra, Melbourne and Brisbane, with Adelaide and Perth movements assessed for each booking.</p>
        </div>
        <div className="route-map-visual">
          <img src="/images/replacement/australia-network-map.webp" alt="Map of Australia illustrating 1st Class Express interstate freight coverage from Sydney to Canberra, Melbourne, Brisbane, Adelaide and Perth" loading="lazy" width="1672" height="941"/>
        </div>
      </div>
    </section>

    <section className="lovable-section lovable-section--dark">
      <div className="container-page">
        <div className="lovable-heading">
          <p className="lovable-kicker">Route Explorer</p>
          <h2>Select A City For Coverage Details</h2>
          <p>Choose a capital city to see how we service that route. Servicing major freight routes across the network below.</p>
        </div>
        <RouteExplorer/>
      </div>
    </section>

    <section className="lovable-section lovable-section--soft">
      <div className="container-page lovable-split">
        <div>
          <div className="lovable-heading">
            <p className="lovable-kicker">Interstate Linehaul</p>
            <h2>Longer Runs, Planned Properly</h2>
            <p>Tell us the pickup, destination, freight profile and preferred timing. We will confirm the route and most suitable transport configuration.</p>
          </div>
          <div className="lovable-actions">
            <Link className="lovable-btn lovable-btn--primary" to="/quote">Request a Route Quote <ArrowRight size={18} aria-hidden="true"/></Link>
            <a className="lovable-btn lovable-btn--secondary" href={phoneHref(company.phonePrimary)}><Phone size={18} aria-hidden="true"/>{company.phonePrimary}</a>
          </div>
        </div>
        <div className="route-assurance">
          <Route aria-hidden="true"/>
          <h3>Availability confirmed per job</h3>
          <p>Interstate services are subject to route, freight, timing, access and compliance requirements.</p>
        </div>
      </div>
    </section>
  </>
}
