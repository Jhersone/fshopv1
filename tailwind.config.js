/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],

  // 👇 AÑADIR ESTE BLOQUE
  safelist: [
    "bg-pesadilla",
  "bg-scoobydoo",
  "bg-dragonball",
  "bg-marvel",
  "bg-dc",
  "bg-starwars",
  "bg-iconseries",
  "bg-gaminglegends",
  "bg-epic",
  "bg-rare",
  "bg-legendary",
  "bg-uncommon",
  "bg-navidad",
  "bg-default",
  ],

  theme: {
    extend: {
      colors: {
        dark: "#0a0a0a",
        darkSecondary: "#1c1c1c",
        primary: "#ff0000",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(15px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease-in-out",
      },
    },
  },
  plugins: [],
};
