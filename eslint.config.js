import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // first-class-express/, opendesign/'s generated bits aside, .superdesign/,
  // _to_delete/, archive-*/ and .codex/ are untracked scratch/reference
  // content that sits alongside this project on disk but is not part of it —
  // `npm run lint` should only ever report on the site itself.
  { ignores: ['dist', 'coverage', 'playwright-report', 'first-class-express', 'opendesign', '.superdesign', '_to_delete', 'archive-*', '.codex'] },
  { extends: [js.configs.recommended, ...tseslint.configs.recommended], files: ['**/*.{ts,tsx}'], languageOptions: { ecmaVersion: 2022, globals: globals.browser }, plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh }, rules: { ...reactHooks.configs.recommended.rules, 'react-refresh/only-export-components': ['warn', { allowConstantExport: true }] } },
  // Serverless functions run on Node, not in the browser, and are not subject to
  // the React Fast Refresh rule.
  {
    files: ['api/**/*.ts'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'react-refresh/only-export-components': 'off' },
  },
)
