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
        darkspot: {
          bg: '#0a0f1d',
          surface: '#111827',
          card: '#182238',
          border: '#233352',
          navy: '#1e3a8a',
          cyan: '#06b6d4',
          teal: '#0d9488',
          amber: '#f59e0b',
          rose: '#f43f5e',
          text: '#f8fafc',
          muted: '#94a3b8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
