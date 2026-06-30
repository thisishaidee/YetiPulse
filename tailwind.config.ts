import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#050505",
          raised: "#0c0c0c",
          card: "#121212",
          hover: "#1a1a1a",
          border: "rgba(255,255,255,0.06)",
        },
        accent: {
          DEFAULT: "#7cb9ff",
          glow: "#93c5fd",
          muted: "#1e3a5f",
          dim: "rgba(124,185,255,0.12)",
        },
        sui: {
          DEFAULT: "#6fbcf0",
          dark: "#4da2ff",
        },
        risk: {
          low: "#34d399",
          medium: "#fbbf24",
          high: "#f87171",
          coral: "#fb7185",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(124,185,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(124,185,255,0.03) 1px, transparent 1px)",
        "hero-glow":
          "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(124,185,255,0.15), transparent 70%)",
        "card-glow":
          "radial-gradient(ellipse at top, rgba(124,185,255,0.06), transparent 60%)",
        "chart-bar":
          "linear-gradient(to top, rgba(124,185,255,0.15), rgba(124,185,255,0.6))",
      },
      boxShadow: {
        glow: "0 0 40px rgba(124,185,255,0.08)",
        card: "0 1px 0 rgba(255,255,255,0.04) inset",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.55s cubic-bezier(0.16,1,0.3,1) forwards",
        "slide-down": "slideDown 0.4s ease-out forwards",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        shimmer: "shimmer 2s infinite linear",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
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
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
