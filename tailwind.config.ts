import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050811',
          900: '#0B132B',
          850: '#0F1A3A',
          800: '#14224D',
          700: '#1C2E66',
          600: '#2A438C',
        },
        gold: {
          100: '#FBF7EA',
          200: '#F5ECCB',
          300: '#EBD899',
          400: '#DFC067',
          500: '#D4AF37',
          600: '#C5A059',
          700: '#A48232',
          800: '#7E6323',
        },
      },
      fontFamily: {
        serif: [
          '"Pretendard"',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
        sans: [
          '"Pretendard"',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          '"Helvetica Neue"',
          '"Segoe UI"',
          '"Apple SD Gothic Neo"',
          '"Malgun Gothic"',
          'sans-serif',
        ],
        mono: [
          '"Pretendard"',
          '-apple-system',
          'BlinkMacSystemFont',
          'ui-monospace',
          'sans-serif',
        ],
      },
      boxShadow: {
        'gold-sm': '0 0 15px rgba(212, 175, 55, 0.15)',
        'gold-md': '0 0 25px rgba(212, 175, 55, 0.25)',
        'gold-lg': '0 0 40px rgba(212, 175, 55, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
