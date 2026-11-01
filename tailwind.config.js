import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F4F7FB',
          100: '#E6ECF4',
          200: '#CBD6E4',
          300: '#A3B4CB',
          400: '#71859F',
          500: '#52667F',
          600: '#3F5169',
          700: '#2E3F57',
          800: '#1F2D42',
          900: '#0F1E33',
        },
        brand: {
          50: '#EFFBFA',
          100: '#D0F4F1',
          200: '#A2E7E2',
          300: '#6AD3CC',
          400: '#34B8B0',
          500: '#13A09A',
          600: '#0C8580',
          700: '#0A6D69',
          800: '#0A5856',
          900: '#094746',
        },
        accent: {
          50: '#EDFCFF',
          100: '#CEF7FF',
          200: '#9EEEFF',
          300: '#5FE0FA',
          400: '#26CBEE',
          500: '#06B1D6',
          600: '#0890B4',
          700: '#0C7291',
          800: '#105D76',
          900: '#124E63',
        },
        secondary: {
          50: '#F3F8FE',
          100: '#E4EFFB',
          200: '#C8DFF6',
          300: '#9CC6EE',
          400: '#6AA6E3',
          500: '#4586D2',
          600: '#2F6CB8',
          700: '#27589A',
          800: '#244B7E',
          900: '#213F69',
        },
        success: colors.emerald,
        warning: colors.amber,
        error: colors.rose,
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 30, 51, 0.04), 0 12px 32px -16px rgba(15, 30, 51, 0.14)',
        'card-hover': '0 2px 4px rgba(15, 30, 51, 0.05), 0 20px 40px -20px rgba(10, 109, 105, 0.3)',
      },
      keyframes: {
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scan: {
          from: { top: '-6rem' },
          to: { top: '100%' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.7s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        scan: 'scan 4.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
