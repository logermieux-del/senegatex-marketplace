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
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-sans)', 'Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
        serif: ['Georgia', 'Garamond', 'serif'],
      },
      colors: {
        // Yembal brand palette: emerald + anthracite + ivory
        primary: {
          50: '#ecfbf6',
          100: '#d2f4e8',
          200: '#a8e8d3',
          300: '#71d4b7',
          400: '#3cb897',
          500: '#0F8B6D', // Emerald (brand green)
          600: '#0c6f58',
          700: '#0a5945',
          800: '#084537',
          900: '#06342a',
        },
        accent: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280', // Neutral gray for muted text/borders
          600: '#4b5563',
          700: '#374151',
          800: '#1F2937', // Anthracite
          900: '#111827',
        },
        // Same brand green as primary — one accent color, not two.
        success: {
          50: '#ecfbf6',
          100: '#d2f4e8',
          200: '#a8e8d3',
          300: '#71d4b7',
          400: '#3cb897',
          500: '#0F8B6D',
          600: '#0c6f58',
          700: '#0a5945',
          800: '#084537',
          900: '#06342a',
        },
        neutral: {
          50: '#F7F7F5', // Ivory background
          100: '#f0f2f5',
          200: '#e1e5eb',
          300: '#d1d8e0',
          400: '#8c95a0',
          500: '#65717c',
          600: '#525866',
          700: '#3d4452',
          800: '#2d3139',
          900: '#1F2937', // Anthracite (primary text color)
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
