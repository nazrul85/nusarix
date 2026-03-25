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
        primary: {
          DEFAULT: '#4361ee',
          light: '#eaf1ff',
          dark: '#1b55e2',
        },
        secondary: {
          DEFAULT: '#805dca',
        },
        success: {
          DEFAULT: '#00ab55',
          light: '#ddf5f0',
        },
        danger: {
          DEFAULT: '#e7515a',
          light: '#fff5f5',
        },
        warning: {
          DEFAULT: '#e2a03f',
          light: '#fff9ed',
        },
        info: {
          DEFAULT: '#2196f3',
          light: '#e7f7ff',
        },
        dark: {
          DEFAULT: '#3b3f5c',
          light: '#888ea8',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      boxShadow: {
        'vristo': '0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.24)',
        'vristo-md': '0 4px 6px rgba(0,0,0,.07), 0 1px 3px rgba(0,0,0,.06)',
      },
    },
  },
  plugins: [],
};
