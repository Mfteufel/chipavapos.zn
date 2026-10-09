import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0B10',
        surface: '#14141C',
        surface2: '#1D1D28',
        line: '#2A2A38',
        muted: '#A3A3B5',
        brand: { DEFAULT: '#A78BFA', strong: '#7C3AED' },
        // Acentos por sabor
        frutilla: { DEFAULT: '#E11D48', soft: '#FB7185' },
        sandia: { DEFAULT: '#22C55E', soft: '#4ADE80', alt: '#FB7185' },
        cereza: { DEFAULT: '#9F1239', soft: '#F472B6' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
