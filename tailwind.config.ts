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
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Afro Sport - Modern Sportive Design
        // Inspired by bold sports branding (black, white, red, orange)
        primary: {
          50: '#fff5f0',
          100: '#ffe5dc',
          200: '#ffccb8',
          300: '#ffb395',
          400: '#ff9a71',
          500: '#ff6b35', // Primary orange - Action & Energy
          600: '#ff5722',
          700: '#e64a19',
          800: '#d84315',
          900: '#c2410c',
        },
        accent: {
          50: '#ffebee',
          100: '#ffcdd2',
          200: '#ff9b9d',
          300: '#ff6b6b',
          400: '#ff5252',
          500: '#d32f2f', // Accent red - Bold & Dynamic
          600: '#c62828',
          700: '#b71c1c',
          800: '#ad1457',
          900: '#880e4f',
        },
        secondary: {
          50: '#f0f0f0',
          100: '#e0e0e0',
          200: '#c0c0c0',
          300: '#a0a0a0',
          400: '#808080',
          500: '#606060', // Secondary gray - Secondary actions
          600: '#404040',
          700: '#303030',
          800: '#1a1a1a',
          900: '#0a0a0a',
        },
      },
      fontSize: {
        // Typography scale inspired by sports design
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
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 20s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(30px, -30px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
