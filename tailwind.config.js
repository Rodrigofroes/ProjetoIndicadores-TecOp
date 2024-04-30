/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        86: '88vh',
        450: '450px'
      },
      width: {
        600: '600px'
      },
      colors: {
        blue: {
          700: '#001529'
        },
        zinc: {
          900: '#EAEEF2'
        }
      }
    },
  },
  plugins: [],
}

