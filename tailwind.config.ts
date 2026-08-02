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
      },
      colors: {
        // Logistics/Delivery Color Palette (from UI/UX Pro Max)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb', // Primary blue - Tracking & Trust
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#ea580c', // Accent orange - Delivery & Energy
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b', // Neutral gray
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
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
