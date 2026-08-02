import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Barlow', 'var(--font-sans)', ...defaultTheme.fontFamily.sans],
        display: ['Barlow Condensed', 'Barlow', ...defaultTheme.fontFamily.sans],
        serif: ['Georgia', 'Garamond', 'serif'],
      },
      colors: {
        // Option C: Hybrid (Bleu + Bronze + Crème) - Premium Sports Palette
        primary: {
          50: '#f9f7f4',
          100: '#f5f2ec', // Crème - warm ink, primary text
          200: '#e8dcc9',
          300: '#d4c1a6',
          400: '#c9a36b', // Bronze/Brass - secondary accents
          500: '#b8925c',
          600: '#9b7a4a',
          700: '#7d633a',
          800: '#6e4d29',
          900: '#5a3d1f',
        },
        accent: {
          50: '#faf5f2',
          100: '#f5ede8',
          200: '#e8d5ce',
          300: '#d4a39b',
          400: '#a97870',
          500: '#8b5a50', // Deep bronze - strong accents & CTAs
          600: '#6e1f23', // Burgundy bronze
          700: '#5a151a',
          800: '#470d12',
          900: '#33070a',
        },
        blue: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Sport blue - primary brand blue
          600: '#0284c7',
          700: '#0369a1', // Deep sport blue
          800: '#075985',
          900: '#0c3d66',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b', // Slate neutral
          600: '#48516b', // Slate midtone
          700: '#334155',
          800: '#1e293b',
          900: '#0a0908', // Near-black ground
        },
      },
      fontSize: {
        // Typography scale: Barlow Condensed for display, Barlow for body
        xs: ['12px', { lineHeight: '1.4', letterSpacing: '0.5px', fontWeight: '700' }],
        sm: ['14px', { lineHeight: '1.5', fontWeight: '500' }],
        base: ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        lg: ['18px', { lineHeight: '1.8', fontWeight: '500' }],
        xl: ['20px', { lineHeight: '1.5', fontWeight: '700' }],
        '2xl': ['28px', { lineHeight: '1.4', fontWeight: '700' }],
        '3xl': ['36px', { lineHeight: '1.3', fontWeight: '900', letterSpacing: '-0.5px' }],
        '4xl': ['48px', { lineHeight: '1.2', fontWeight: '900', letterSpacing: '-1px' }],
        '5xl': ['72px', { lineHeight: '1.1', fontWeight: '900', letterSpacing: '-2px' }],
      },
      spacing: {
        gutter: '1.5rem',
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out',
        slideUp: 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
