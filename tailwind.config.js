/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          200: "#D5DAE1",
        },
        black: {
          DEFAULT: "#000",
          500: "#1D2235",
        },
        blue: {
          500: "#2b77e7",
        },
        ubuntu: {
          orange: "#E95420",
          "orange-light": "#F07746",
          aubergine: "#2C001E",
          "aubergine-dark": "#1C0012",
          purple: "#772953",
          "warm-grey": "#AEA79F",
          "cool-grey": "#333333",
          panel: "#1B1B1B",
        },
      },
      fontFamily: {
        worksans: ["Work Sans", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        mono: ["Ubuntu Mono", "Consolas", "monospace"],
      },
      boxShadow: {
        card: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
