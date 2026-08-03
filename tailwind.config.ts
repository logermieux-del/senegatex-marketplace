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
        sans: ['Open Sans', 'var(--font-sans)', ...defaultTheme.fontFamily.sans],
        display: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        serif: ['Georgia', 'Garamond', 'serif'],
      },
      colors: {
        // Midnight Blue + Slategray Professional Palette
        primary: {
          50: '#f5f7fb',
          100: '#e8ecf5',
          200: '#c9d5e8',
          300: '#a9bdd8',
          400: '#5a7fa8',
          500: '#191970', // Midnight Blue
          600: '#151562',
          700: '#11104d',
          800: '#0d0c39',
          900: '#09082a',
        },
        accent: {
          50: '#f6f9fc',
          100: '#eef5f8',
          200: '#d4e5ee',
          300: '#b9d5e3',
          400: '#8ab5ce',
          500: '#708090', // Slategray
          600: '#64747b',
          700: '#525860',
          800: '#414549',
          900: '#2d3032',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Keep green for "Vendre" CTA
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#145231',
        },
        neutral: {
          50: '#f8f9fa',
          100: '#f0f2f5',
          200: '#e1e5eb',
          300: '#d1d8e0',
          400: '#8c95a0',
          500: '#65717c',
          600: '#525866',
          700: '#3d4452',
          800: '#2d3139',
          900: '#1a1d23',
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
