import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#07111F',
        panel: '#0D1B2A',
        card: '#112235',
        primary: colors.cyan,
        secondary: colors.violet,
        success: colors.emerald,
        warning: colors.amber,
        danger: colors.rose,
        neutral: colors.slate,
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255, 255, 255, 0.04) inset, 0 24px 48px -28px rgba(2, 6, 15, 0.8)',
        glow: '0 0 0 1px rgba(34, 211, 238, 0.2), 0 0 40px -10px rgba(34, 211, 238, 0.45)',
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
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(3%, -2%, 0) scale(1.08)' },
        },
        scan: {
          from: { top: '-6rem' },
          to: { top: '100%' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to: { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
        drift: 'drift 22s ease-in-out infinite',
        scan: 'scan 4s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite',
      },
    },
  },
  plugins: [],
};
