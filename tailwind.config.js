/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        mono: {
          100: '#F9F9F9',
          200: '#F6F6F8',
          300: '#F0EEEC',
          400: '#D9D9D9',
          500: '#898989',
          600: '#22272B',
        },
        point: '#FFDC53',
        accent: '#EAF6F9',
      },
    },
  },

  plugins: [],
};
