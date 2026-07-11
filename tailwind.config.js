/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: {
            DEFAULT: '#0B192C',
            light: '#1E293B',
            dark: '#030712'
          },
          green: {
            DEFAULT: '#1E5128',
            light: '#4E9F3D',
            dark: '#191A19'
          },
          light: '#F8FAFC',
          border: '#CBD5E1',
          text: '#1E293B',
        },
        status: {
          licensed: '#15803D', // Dark Green
          unlicensed: '#B91C1C', // Dark Red
          pending: '#B45309', // Amber
          govt: '#1D4ED8', // Blue
          inactive: '#4B5563' // Gray
        },
        brand: {
          DEFAULT: '#0F6E4F',
          dark: '#004B24',
          button: '#006633',
          subtle: '#336F50',
          dot: '#E2E8F8',
          footer: '#9FC5B9'
        },
        ink: {
          DEFAULT: '#151C27',
          muted: '#3F4940'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'ui-sans-serif', 'system-ui'],
      }
    }
  },
  plugins: [],
}
