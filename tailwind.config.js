/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Fraunces', 'serif'],
      },
      colors: {
        sage: {
          50:  '#f3f7f3',
          100: '#e3ede4',
          200: '#c8dbc9',
          300: '#9dc09f',
          400: '#6b9e6e',
          500: '#477f4b',
          600: '#356439',
          700: '#2b502e',
          800: '#244027',
          900: '#1e3521',
        },
        cream: '#FAF8F3',
        charcoal: '#1C1C1E',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}