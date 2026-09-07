/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#FAF7F2',
          100: '#F5EFEB',
          200: '#EAE1D9',
          300: '#D8C9BD',
          400: '#BFA898',
          500: '#A48976',
          600: '#866B59',
          700: '#644F41',
          800: '#3D3027',
          900: '#231B15',
          950: '#120E0C',
        },
        brand: {
          amber: '#F59E0B',
          orange: '#EA580C',
          sunset: '#F97316',
          crimson: '#E11D48',
          emerald: '#10B981',
          teal: '#14B8A6',
          sky: '#0284C7',
          darkBg: '#0D0A08',
          darkCard: 'rgba(26, 21, 18, 0.75)',
          lightBg: '#FDFBF7',
          lightCard: 'rgba(255, 255, 255, 0.75)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
        glassLight: '0 8px 30px 0 rgba(180, 150, 130, 0.15)',
        glowAmber: '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        glowOrange: '0 0 25px -5px rgba(234, 88, 12, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
