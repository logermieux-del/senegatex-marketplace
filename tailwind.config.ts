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
        // Premium Sports Palette: Navy Blue + White + Black
        primary: {
          50: '#ffffff',
          100: '#f8f8f8', // White - primary text
          200: '#f0f0f0',
          300: '#e8e8e8',
          400: '#e0e0e0',
          500: '#d8d8d8',
          600: '#c0c0c0',
          700: '#a8a8a8',
          800: '#808080',
          900: '#000000', // Black
        },
        accent: {
          50: '#f0f7ff',
          100: '#e0eeff',
          200: '#c1ddff',
          300: '#a2ccff',
          400: '#0d47a1', // Navy blue - strong accents & CTAs
          500: '#0d3d91',
          600: '#0a2e73',
          700: '#081e55',
          800: '#051437',
          900: '#030a1f',
        },
        blue: {
          50: '#f0f7ff',
          100: '#e0eeff',
          200: '#c1ddff',
          300: '#a2ccff',
          400: '#6b9eff',
          500: '#2563eb', // Medium blue - primary brand blue
          600: '#1d4ed8',
          700: '#1e40af', // Deep blue
          800: '#1e3a8a', // Navy blue
          900: '#0c2340', // Very deep navy
        },
        secondary: {
          50: '#ffffff',
          100: '#f8f8f8',
          200: '#f0f0f0',
          300: '#e8e8e8',
          400: '#d0d0d0',
          500: '#b0b0b0',
          600: '#808080',
          700: '#505050',
          800: '#202020',
          900: '#000000', // Pure black ground
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
