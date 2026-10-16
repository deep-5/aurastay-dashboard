/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hotel: {
          bg: '#FFFFFF',
          sidebar: '#FFFFFF',
          card: '#FFFFFF',
          text: '#19202D',
          subtext: '#6B7280',
          primary: '#2583E9',
          primaryHover: '#1768C4',
          selected: '#EAF3FF',
          border: '#E7EBF0',
          section: '#F8FAFC',
          // Signature Figma colors from uploaded references:
          lime: '#D2F829',
          limeHover: '#C2E820',
          limeLight: '#F5FDD6',
          salmon: '#FA6B6B',
          salmonLight: '#FEECEC',
          success: '#20A66A',
          warning: '#F4C928',
          error: '#E85B63',
          info: '#3298E8',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'card': '0 2px 6px 0 rgba(16, 24, 40, 0.04)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
