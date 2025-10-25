/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#059669', // Changed to emerald green
        secondary: '#10b981', // Light emerald
        accent: '#34d399', // Bright emerald
        success: '#10b981', // Emerald
        warning: '#f59e0b', // Amber
        error: '#ef4444', // Red
        dark: '#1f2937', // Dark gray
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
        'gradient-accent': 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
      },
      fontFamily: {
        sans: ["'Poppins'", "sans-serif"],
        serif: ["'Playfair Display'", "serif"],
      },

    },
  },
  plugins: [],
};
