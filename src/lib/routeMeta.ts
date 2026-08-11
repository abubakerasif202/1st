import routeSeo from '../data/routeSeo.json'

export interface RouteMeta {
  path: string
  title: string
  description: string
}

// routeSeo.json is keyed by camelCase name, but detail pages only know their own
// URL. Indexing by path keeps the two in sync without every page having to guess
// a key name — a wrong guess silently fell back to generated metadata before,
// which is how /services/* shipped without its curated titles.
const byPath = new Map<string, RouteMeta>(
  Object.values(routeSeo as Record<string, RouteMeta>).map((route) => [route.path, route]),
)

/** Curated metadata for a path, or undefined when the path is not in routeSeo.json. */
export function findRouteMeta(path: string): RouteMeta | undefined {
  return byPath.get(path)
}
