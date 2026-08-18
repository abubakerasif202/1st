/// <reference types="vite/client" />

/**
 * React 18's DOM typings predate the `inert` attribute. It is a real HTML
 * attribute (Chrome 102+, Safari 15.5+, Firefox 112+) and React passes it
 * through verbatim, so declaring it here is a typing gap, not a hack.
 * Used by the form honeypots, which must be neither focusable nor announced.
 */
import 'react'

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- T must match React's signature for the merge to apply
  interface HTMLAttributes<T> {
    inert?: '' | undefined
  }
}
