/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cork: {
          DEFAULT: "#8B6544",
          dark: "#6B4C33",
          light: "#A47B52",
        },
        paper: {
          DEFAULT: "#FBF6EA",
          aged: "#EFE3C8",
        },
        ink: {
          DEFAULT: "#241A12",
          soft: "#5B4B3A",
        },
        pin: {
          DEFAULT: "#C1432E",
          dark: "#9E351F",
        },
        tape: {
          DEFAULT: "#3B5A73",
          dark: "#2C4557",
        },
        marker: {
          DEFAULT: "#E7B23E",
        },
        leaf: {
          DEFAULT: "#4B7355",
        },
      },
      fontFamily: {
        display: ["Anton", "sans-serif"],
        hand: ["Kalam", "cursive"],
        body: ["'IBM Plex Sans'", "sans-serif"],
      },
      backgroundImage: {
        cork: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.05) 0, transparent 45%), radial-gradient(circle at 80% 60%, rgba(0,0,0,0.12) 0, transparent 50%)",
      },
      boxShadow: {
        pin: "0 10px 20px -8px rgba(36,26,18,0.45)",
        card: "0 6px 14px -4px rgba(36,26,18,0.35)",
      },
      rotate: {
        1.5: "1.5deg",
        "-1.5": "-1.5deg",
        2.5: "2.5deg",
        "-2.5": "-2.5deg",
      },
    },
  },
  plugins: [],
};
