/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0A0A0A',
          surface: '#121214',
          card: '#18181B',
          border: '#27272A',
          hover: '#202025',
          light: '#FAFAFA',
          muted: '#A1A1AA',
          indigo: '#4F46E5',
          indigoLight: '#6366F1',
          cyan: '#06B6D4',
          cyanLight: '#22D3EE',
          emerald: '#10B981',
          rose: '#F43F5E',
          amber: '#F59E0B'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glow-indigo': '0 0 25px -5px rgba(79, 70, 229, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(24, 24, 27, 0.8) 0%, rgba(18, 18, 20, 0.95) 100%)'
      }
    },
  },
  plugins: [],
}
