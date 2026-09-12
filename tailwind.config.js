/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        haryana: {
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          primary: '#3b82f6',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#ef4444',
          purple: '#8b5cf6',
        }
      }
    },
  },
  plugins: [],
}
