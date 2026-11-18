/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B2545',
          50: '#F0F4FA',
          100: '#DCE5F2',
          200: '#B8CBE5',
          300: '#8FAED4',
          400: '#5C8ABE',
          500: '#3468A3',
          600: '#234C82',
          700: '#183863',
          800: '#0E294A',
          900: '#0B2545',
          950: '#061528'
        },
        gold: {
          DEFAULT: '#E8A020',
          50: '#FEF9EE',
          100: '#FDF1D6',
          200: '#FBE0A9',
          300: '#F8CE7C',
          400: '#F4BA49',
          500: '#E8A020',
          600: '#C78011',
          700: '#9C600B',
          800: '#7B4A0D',
          900: '#643C0E',
          950: '#3A1F04'
        },
        surface: '#F4F6FB',
      },
      fontFamily: {
        heading: ['Syne', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 4px 20px -2px rgba(11, 37, 69, 0.06), 0 2px 6px -1px rgba(11, 37, 69, 0.04)',
        hover: '0 12px 30px -4px rgba(11, 37, 69, 0.12), 0 4px 10px -2px rgba(11, 37, 69, 0.06)',
        goldGlow: '0 0 20px rgba(232, 160, 32, 0.35)',
      }
    },
  },
  plugins: [],
}
