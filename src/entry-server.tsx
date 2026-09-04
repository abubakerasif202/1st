import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import type { PageMap } from './app/pageLoaders'
import { pageLoaders } from './app/pageLoaders'
import { SiteRoutes } from './app/routes'

let pages: PageMap | undefined

// Every page is imported up front so the tree renders eagerly — React.lazy would
// only put the Suspense fallback into the static HTML.
async function resolvePages(): Promise<PageMap> {
  if (pages) return pages
  const [home, about, services, serviceDetail, fleet, fleetDetail, serviceAreas, serviceAreaDetail, routeDetail, book, freightTerms, customerApplication, quoteConfirmation, quoteRespond, contact, careers, driverHandbook, notFound] = await Promise.all([
    pageLoaders.home(), pageLoaders.about(), pageLoaders.services(), pageLoaders.serviceDetail(),
    pageLoaders.fleet(), pageLoaders.fleetDetail(), pageLoaders.serviceAreas(), pageLoaders.serviceAreaDetail(),
    pageLoaders.routeDetail(), pageLoaders.book(), pageLoaders.freightTerms(), pageLoaders.customerApplication(),
    pageLoaders.quoteConfirmation(), pageLoaders.quoteRespond(), pageLoaders.contact(), pageLoaders.careers(),
    pageLoaders.driverHandbook(), pageLoaders.notFound(),
  ])
  pages = {
    home: home.default, about: about.default, services: services.default, serviceDetail: serviceDetail.default,
    fleet: fleet.default, fleetDetail: fleetDetail.default, serviceAreas: serviceAreas.default,
    serviceAreaDetail: serviceAreaDetail.default, routeDetail: routeDetail.default,
    book: book.default, freightTerms: freightTerms.default, customerApplication: customerApplication.default,
    quoteConfirmation: quoteConfirmation.default, quoteRespond: quoteRespond.default, contact: contact.default,
    careers: careers.default, driverHandbook: driverHandbook.default, notFound: notFound.default,
  }
  return pages
}

export async function render(url: string): Promise<string> {
  const resolved = await resolvePages()
  return renderToString(<StaticRouter location={url}><SiteRoutes pages={resolved} /></StaticRouter>)
}
