/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1F2A44',
          'navy-dark': '#131B2E',
          'navy-light': '#2A395C',
          teal: '#0E7C86',
          'teal-dark': '#095C64',
          'teal-light': '#149AA7',
          light: '#EAF4F5',
          'light-hover': '#DBEDEF',
        },
        severity: {
          blocking: '#DC2626',
          'blocking-bg': '#FEF2F2',
          'blocking-border': '#FECACA',
          should_fix: '#D97706',
          'should_fix-bg': '#FFFBEB',
          'should_fix-border': '#FDE68A',
          suggestion: '#2563EB',
          'suggestion-bg': '#EFF6FF',
          'suggestion-border': '#BFDBFE',
        }
      }
    },
  },
  plugins: [],
}
