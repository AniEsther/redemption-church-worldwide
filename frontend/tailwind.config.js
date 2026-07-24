/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brown: {
          DEFAULT: '#6B4226',
          50: '#F6EEE7',
          100: '#EADBCB',
          200: '#D3B491',
          300: '#B98D5F',
          400: '#8A5C36',
          500: '#6B4226',
          600: '#54341E',
          700: '#3E2616',
          800: '#2A190E',
          900: '#180D07',
        },
        orange: {
          DEFAULT: '#E2761C',
          50: '#FDEEE0',
          100: '#FBDAB8',
          200: '#F7B87A',
          300: '#F0983F',
          400: '#E2761C',
          500: '#BD5F14',
          600: '#93490F',
          700: '#69340B',
        },
        yellow: {
          DEFAULT: '#F9E29C',
          50: '#FFFCF3',
          100: '#FFF7DE',
          200: '#FCEFC0',
          300: '#F9E29C',
          400: '#F3D06B',
          500: '#E6B93E',
        },
        cream: '#FFF8E7',
        ink: '#14100C',
        give: {
          DEFAULT: '#3F6B47',
          400: '#4C7F55',
          500: '#3F6B47',
          600: '#335939',
        },
      },
      fontFamily: {
        display: ['var(--font-heading)', '"Playfair Display"', 'serif'],
        eyebrow: ['"Cinzel"', 'serif'],
        body: ['var(--font-body)', '"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'ray-gradient':
          'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226,118,28,0.25), transparent 70%)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: 0, transform: 'translateY(28px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-18px) translateX(8px)' },
        },
        rayspin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        flipIn: {
          '0%': { transform: 'rotateY(90deg)', opacity: 0 },
          '60%': { transform: 'rotateY(-12deg)', opacity: 1 },
          '100%': { transform: 'rotateY(0deg)', opacity: 1 },
        },
        growLine: {
          '0%': { width: '0px', opacity: 0 },
          '100%': { width: '96px', opacity: 1 },
        },
      },
      animation: {
        rise: 'rise 0.9s cubic-bezier(0.22,1,0.36,1) forwards',
        drift: 'drift 7s ease-in-out infinite',
        rayspin: 'rayspin 60s linear infinite',
        shimmer: 'shimmer 3s linear infinite',
        growLine: 'growLine 1.2s cubic-bezier(0.22,1,0.36,1) both',
        flipIn: 'flipIn 0.8s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
}
