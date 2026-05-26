import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        // Paleta MenteSolidária — acolhimento + segurança
        mint:  { DEFAULT: '#A9E8D6', 50: '#F2FBF8', 100: '#DCF4EC', 200: '#A9E8D6', 300: '#7FDAC0', 400: '#4FC4A2', 500: '#2BAA85', 600: '#1F8B6C', 700: '#1A6E55' },
        leaf:  { DEFAULT: '#BCDB9E', 50: '#F4FAEE', 100: '#E3F2D2', 200: '#BCDB9E', 300: '#9CC974', 400: '#79B14B', 500: '#5C9534', 600: '#467327' },
        sun:   { DEFAULT: '#FFF791', 50: '#FFFEEC', 100: '#FFFCC4', 200: '#FFF791', 300: '#FFEF55', 400: '#F5DD1F', 500: '#C9B40C' },
        coral: { DEFAULT: '#C22251', 50: '#FCE8EE', 100: '#F7C5D2', 200: '#EA8AA6', 300: '#DB517C', 400: '#C22251', 500: '#9E1A40', 600: '#7A1331', 700: '#560D21' },
        cream: { DEFAULT: '#FFFFFA', 50: '#FFFFFA', 100: '#FAFAF2' }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      boxShadow: {
        soft: '0 4px 14px -4px rgba(40, 95, 75, 0.12)'
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out'
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
