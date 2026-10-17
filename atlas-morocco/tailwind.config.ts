// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Terracotta: the clay of Marrakech's walls. Primary actions use brand-600 (white text passes WCAG AA).
        brand: {
          DEFAULT: "#B84D28",
          50: "#FDF6F2",
          100: "#FBE9DF",
          200: "#F6CFBA",
          300: "#EFAC8C",
          400: "#E5835A",
          500: "#D2633A",
          600: "#B84D28",
          700: "#973D21",
          800: "#7A3320",
          900: "#642D1E",
        },
        // Majorelle blue: the single accent, for information and links that aren't primary actions.
        majorelle: {
          DEFAULT: "#2448B8",
          50: "#EEF3FF",
          100: "#DCE6FE",
          200: "#BCCEFC",
          500: "#2F5BD3",
          600: "#2448B8",
          700: "#1E3A94",
          800: "#1C3277",
        },
        // Warm page backgrounds.
        sand: {
          DEFAULT: "#F5EFE5",
          50: "#FBF8F3",
          100: "#F5EFE5",
          200: "#EADFCB",
          300: "#DCCBAE",
        },
      },
      borderRadius: {
        card: "1rem",
        "card-sm": "0.75rem",
        "card-lg": "1.5rem",
        pill: "999px",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,.06)",
        card: "0 4px 14px rgba(0,0,0,.06)",
        "card-hover": "0 10px 25px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
        premium: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
      },
      fontFamily: {
        // Titles: Poppins, Body: Inter
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        fadeIn: "fadeIn 0.35s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "none" },
        },
      },
    },
  },
  plugins: [],
};
export default config;