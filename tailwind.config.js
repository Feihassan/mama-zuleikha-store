/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1', // Indigo
        secondary: '#8b5cf6', // Violet
        accent: '#a855f7', // Purple
        success: '#10b981', // Emerald
        warning: '#f59e0b', // Amber
        error: '#ef4444', // Red
        dark: '#1f2937', // Dark gray
        light: '#f8fafc', // Light gray
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
        'gradient-accent': 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
      },
      fontFamily: {
        sans: ["'Poppins'", "sans-serif"],
        serif: ["'Playfair Display'", "serif"],
      },

    },
  },
  plugins: [],
};
