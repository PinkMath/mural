/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Space Grotesk', 'sans-serif'],
          bebas: ['Bebas Neue', 'cursive'],
          serif: ['DM Serif Display', 'serif'],
        },
        colors: {
          cyan: {
            DEFAULT: '#00ffcc',
            400: '#00ffcc',
          },
        },
        transitionDuration: {
          '400': '400ms',
        },
      },
    },
    plugins: [],
  }
