/** @type {import('tailwindcss').Config} */
export default {
  // THIS IS THE CRUCIAL PART: It tells Tailwind where to look for your classes
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          light: '#e0f2fe',
          DEFAULT: '#0284c7',
          dark: '#075985'
        }
      }
    },
  },
  plugins: [],
}