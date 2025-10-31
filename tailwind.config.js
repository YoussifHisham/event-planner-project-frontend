/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "brand-dark": "#0C2B4E",
        "brand-medium": "#1A3D64",
        "brand-accent": "#1D546C",
        "brand-gray": "#F4F4F4",
      },
    },
  },
  plugins: [],
};
