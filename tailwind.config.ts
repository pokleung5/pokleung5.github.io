import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem'
    },
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        sans: ['var(--font-sans)', 'sans-serif']
      },
      colors: {
        background: '#050505',
        foreground: '#F5F5F6',
        primary: {
          DEFAULT: '#0F0F0F',
          foreground: '#F8FAFC'
        },
        accent: {
          DEFAULT: '#1E1E1E',
          foreground: '#F8FAFC'
        },
        muted: {
          DEFAULT: '#262626',
          foreground: '#E5E7EB'
        },
        glow: '#111111'
      },
      boxShadow: {
        glow: '0 0 45px rgba(10, 10, 10, 0.55)'
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(circle at top, rgba(32, 32, 32, 0.55), transparent 60%)',
        'aurora-wave':
          'linear-gradient(120deg, rgba(30,30,30,0.6), rgba(5,5,5,0.85) 60%), radial-gradient(circle at 20% 20%, rgba(64,64,64,0.45), transparent 45%)'
      },
      animation: {
        float: 'float 12s ease-in-out infinite',
        orbit: 'orbit 18s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(-8px)' },
          '50%': { transform: 'translateY(8px)' }
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }
    }
  },
  plugins: [animate]
};

export default config;
