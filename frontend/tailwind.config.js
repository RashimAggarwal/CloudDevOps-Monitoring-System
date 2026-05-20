/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        shield: {
          bg: "#070b14",
          panel: "#0f1724",
          panelSoft: "#121c2c",
          line: "#263449",
          cyan: "#22d3ee",
          green: "#34d399",
          amber: "#f59e0b",
          red: "#fb7185"
        }
      },
      boxShadow: {
        glow: "0 0 32px rgba(34, 211, 238, 0.14)"
      }
    }
  },
  plugins: []
};
