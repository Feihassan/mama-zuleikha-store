/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ec4899", // rose pink
        secondary: "#fce7f3", // soft blush
        accent: "#f9a8d4", // lighter pink
        dark: "#4b5563", // slate
      },
      fontFamily: {
        sans: ["'Poppins'", "sans-serif"],
        serif: ["'Playfair Display'", "serif"],
      },

    },
  },
  plugins: [],
};
