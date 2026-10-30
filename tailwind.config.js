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
        cyber: {
          bg: '#0a0d14',
          card: 'rgba(16, 22, 34, 0.75)',
          border: 'rgba(56, 189, 248, 0.15)',
          cyan: '#00f0ff',
          neonGreen: '#00df89',
          purple: '#8b5cf6',
          danger: '#ff3366',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.35)',
        'glow-green': '0 0 20px rgba(0, 223, 137, 0.35)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.35)',
        'glow-red': '0 0 20px rgba(255, 51, 102, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
