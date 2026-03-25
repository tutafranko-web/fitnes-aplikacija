import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fit: {
          bg: '#060810',
          card: 'rgba(255,255,255,0.035)',
          border: 'rgba(255,255,255,0.06)',
          accent: '#00f0b5',
          secondary: '#7c5cfc',
          warn: '#ff6b4a',
          blue: '#3ea8ff',
          gold: '#ffc233',
          pink: '#ff4d8d',
          text: '#e8eaf0',
          muted: '#8b8fa3',
          dim: '#4a4e62',
        },
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      keyframes: {
        spin: { to: { transform: 'rotate(360deg)' } },
        pulse3: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-50%) translateY(-20px)' },
          to: { opacity: '1', transform: 'translateX(-50%) translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'spin-slow': 'spin 1s linear infinite',
        pulse3: 'pulse3 1s infinite',
        'slide-in': 'slideIn 0.4s ease',
        'fade-in': 'fadeIn 0.3s ease',
      },
    },
  },
  plugins: [],
};

export default config;
