/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#020A18',
          panel: 'rgba(5, 19, 45, 0.7)',
          accent: '#00E5FF',
          accentDark: '#00B8CC',
          highlight: '#FF5500',
          grid: '#112240',
        }
      },
      boxShadow: {
        'panel-glow': '0 0 15px rgba(0, 229, 255, 0.2), inset 0 0 15px rgba(0, 229, 255, 0.1)',
        'accent-glow': '0 0 10px rgba(0, 229, 255, 0.5)',
        'highlight-glow': '0 0 10px rgba(255, 85, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
