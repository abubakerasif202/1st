/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // Colours live in src/styles/theme.css as CSS custom properties, not here:
    // the site is hand-written CSS and never used a `brand-*` utility, so the
    // palette that used to sit in this file was a second source of truth that
    // could only drift. The `fontFamily` block was worse — it declared Inter,
    // which the site has never loaded.
    extend: {
      fontFamily: {
        display: ['Archivo', 'Segoe UI', 'Arial', 'sans-serif'],
        sans: ['Barlow', 'Segoe UI', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
