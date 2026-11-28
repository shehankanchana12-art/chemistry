/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        si: ['"Noto Sans Sinhala"', 'sans-serif'],
        serif_si: ['"Abhaya Libre"', '"Noto Sans Sinhala"', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          950: '#05090f',
          900: '#080e18',
          850: '#0b1320',
          800: '#101a2b',
          700: '#18253a',
        },
        lab: {
          teal: '#5eead4',
          violet: '#a78bfa',
          amber: '#fbbf24',
          rose: '#fb7185',
        },
      },
      boxShadow: {
        glow: '0 0 40px -12px rgba(94,234,212,0.45)',
      },
      keyframes: {
        floatUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: { floatUp: 'floatUp .3s ease-out both' },
    },
  },
  plugins: [],
}
