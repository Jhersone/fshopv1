/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#0a0a0a",
        darkSecondary: "#1c1c1c",
        primary: "#ff0000",
      },
    },
  },
  plugins: [],
};
