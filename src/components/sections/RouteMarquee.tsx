// Real corridors only: Sydney/Melbourne/Brisbane/Canberra have their own
// linehaul detail pages (see src/data/interstateRoutes.ts). Adelaide and Perth
// are assessed per movement rather than fixed routes, so they are deliberately
// left out of this strip — listing them here would imply a scheduled service
// that does not exist.
const items = [
  'Sydney',
  'Melbourne',
  'Brisbane',
  'Canberra',
  'Interstate Linehaul',
  'Same Day & Next Day',
  'Bulk Freight',
  'Logistics Support',
]

export function RouteMarquee() {
  return (
    <div className="route-marquee" aria-hidden="true">
      <div className="route-marquee__track">
        {[0, 1].map(pass => (
          <div className="route-marquee__set" key={pass}>
            {items.map((item, index) => (
              <span className="route-marquee__item" key={`${pass}-${item}`}>
                {item}
                {index < items.length - 1 && <span className="route-marquee__dot">●</span>}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
