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
        brand: {
          primary: '#4F46E5',
          primaryLight: '#6366F1',
          primaryDark: '#3730A3',
          accent: '#06B6D4',
          accentLight: '#22D3EE',
          violet: '#8B5CF6',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          sky: '#0284C7',
          teal: '#14B8A6',
          darkBg: '#0B0F19',
          darkCard: 'rgba(15, 23, 42, 0.75)',
          lightBg: '#F8FAFC',
          lightCard: 'rgba(255, 255, 255, 0.85)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
        xl: '20px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.36)',
        glassLight: '0 8px 30px 0 rgba(148, 163, 184, 0.12)',
        glowBrand: '0 0 25px -5px rgba(79, 70, 229, 0.45)',
        glowCyan: '0 0 25px -5px rgba(6, 182, 212, 0.45)',
        glowEmerald: '0 0 25px -5px rgba(16, 185, 129, 0.45)',
        glowAmber: '0 0 25px -5px rgba(245, 158, 11, 0.45)',
        glowRose: '0 0 25px -5px rgba(244, 63, 94, 0.45)',
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
