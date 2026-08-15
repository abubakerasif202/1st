import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// A machine-wide NODE_ENV=production makes Vite resolve React's production
// build inside Vitest, and every render() then fails with "act(...) is not
// supported in production builds of React". Vitest only defaults NODE_ENV when
// it is unset, so pin it here before the React plugin resolves anything.
if (process.env.VITEST) process.env.NODE_ENV = 'test'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    css: true,
  },
})
