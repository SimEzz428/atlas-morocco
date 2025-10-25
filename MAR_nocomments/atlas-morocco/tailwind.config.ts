// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Morocco-inspired premium palette
        brand: {
          DEFAULT: "#C67C2B",     // terracotta - primary brand color
          dark: "#A0661F",
          light: "#F4E4BC",
          50: "#FEF7ED",
          100: "#FDEDD3",
          200: "#FBD9A5",
          300: "#F9C078",
          400: "#F7A74A",
          500: "#C67C2B",
          600: "#A0661F",
          700: "#7A4F17",
          800: "#54380F",
          900: "#2E2008",
        },
        primary: {
          DEFAULT: "#C67C2B",
          dark: "#A0661F",
          light: "#F4E4BC",
        },
        secondary: {
          DEFAULT: "#2E4057",     // ink/navy
          dark: "#1E2A3A",
          light: "#8FA3B8",
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        accent: {
          DEFAULT: "#059669",     // emerald
          dark: "#047857",
          light: "#A7F3D0",
        },
        sand: "#E6D8B7",
        ink: "#1E293B",            // slate-800
        line: "#E2E8F0",           // slate-200
        surface: "#FFFFFF",
        "surface-elevated": "#F8FAFC",
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
        glow: "0 0 20px rgba(198, 124, 43, 0.3)",
      },
      fontFamily: {
        // Titles: Poppins, Body: Inter
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        hero: ["4rem", { lineHeight: "1", letterSpacing: "-0.025em" }],
        "hero-sm": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        display: ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.025em" }],
        "display-sm": ["2rem", { lineHeight: "1.3", letterSpacing: "-0.025em" }],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      animation: {
        fadeIn: "fadeIn 0.6s ease-out",
        slideUp: "slideUp 0.6s ease-out",
        scaleIn: "scaleIn 0.6s ease-out",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
        slideInLeft: "slideInLeft 0.6s ease-out",
        slideInRight: "slideInRight 0.6s ease-out",
        bounceIn: "bounceIn 0.8s ease-out",
        stagger: "stagger 0.6s ease-out",
        floatSlow: "floatSlow 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(198, 124, 43, 0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(198, 124, 43, 0.4)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        stagger: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(198, 124, 43, 0.2)" },
          "50%": { boxShadow: "0 0 25px rgba(198, 124, 43, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;