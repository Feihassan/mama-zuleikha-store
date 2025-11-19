/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#059669', // Emerald
        secondary: '#0d9488', // Teal
        accent: '#7c3aed', // Violet
        success: '#10b981', // Emerald
        warning: '#f59e0b', // Amber
        error: '#ef4444', // Red
        dark: '#1f2937', // Dark gray
        light: '#f8fafc', // Light gray
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #0d9488 0%, #7c3aed 100%)',
        'gradient-accent': 'linear-gradient(135deg, #7c3aed 0%, #059669 100%)',
      },
      fontFamily: {
        sans: ["'Poppins'", "sans-serif"],
        serif: ["'Playfair Display'", "serif"],
      },

    },
  },
  plugins: [],
};
