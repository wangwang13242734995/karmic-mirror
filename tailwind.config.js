/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        karmic: {
          bg: '#0a0a0f',
          card: '#14141f',
          border: '#1e1e2e',
          gold: '#c9a96e',
          accent: '#7c5cfc',
          danger: '#e74c3c',
          muted: '#6b6b7b',
          text: '#e0dcd0',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
      }
    },
  },
  plugins: [],
}
