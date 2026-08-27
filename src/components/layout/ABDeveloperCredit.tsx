const AB_STUDIO_URL = 'https://www.abwebstudio.com.au/'

export function ABDeveloperCredit() {
  return <div className="developer-credit">
    <span className="developer-credit__label">Designed &amp; Developed by</span>
    <a className="developer-credit__link" href={AB_STUDIO_URL} target="_blank" rel="noopener noreferrer" aria-label="Visit AB Digital Solutions">
      <img src="/brand/ab-digital-solutions-watermark.webp" alt="AB Digital Solutions" width="648" height="302" />
      <span className="developer-credit__arrow" aria-hidden="true">↗</span>
    </a>
  </div>
}
