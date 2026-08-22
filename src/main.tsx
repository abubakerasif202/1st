import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app/App'
import { preloadPageForPath } from './app/pageLoaders'
import './styles/theme.css'
import './styles/index.css'
import './styles/lovable-refresh.css'
import './styles/motion.css'
import './styles/driver-handbook.css'

const container = document.getElementById('root')!
const tree = <React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>

// The build prerenders every route into #root, so a normal page load hydrates.
// `npm run dev` serves an empty shell and falls back to a client render.
//
// Hydration waits for the current route's lazy chunk: hydrating first would
// suspend immediately and replace the prerendered content with the Suspense
// fallback. Later navigations still code-split normally.
if (container.hasChildNodes()) {
  preloadPageForPath(window.location.pathname)
    .catch(() => undefined) // A failed chunk still hydrates; Suspense retries it.
    .then(() => hydrateRoot(container, tree))
} else {
  createRoot(container).render(tree)
}
