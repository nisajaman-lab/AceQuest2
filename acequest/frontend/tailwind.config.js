/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          light: '#2d3d5f',
          DEFAULT: '#1a2744',
          dark: '#0f172a',
        },
        teal: {
          light: '#33d9e8',
          DEFAULT: '#00bcd4',
          dark: '#00838f',
        },
        gold: {
          light: '#f7d046',
          DEFAULT: '#f5c518',
          dark: '#c59b0f',
        },
        crimson: {
          light: '#d34343',
          DEFAULT: '#c62828',
          dark: '#8e1c1c',
        }
      },
      fontFamily: {
        game: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
