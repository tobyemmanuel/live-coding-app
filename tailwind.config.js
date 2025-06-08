/** @type {import('tailwindcss').Config} */

export default {
  darkMode: 'class',
  content: [
    './src/renderer/**/*.{js,ts,jsx,tsx,html}',
    './src/renderer/src/index.css',
    './src/renderer/index.html',
  ],
  theme: {},
  plugins: [require('tailwind-scrollbar')],
}
