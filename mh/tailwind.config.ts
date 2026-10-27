import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Dark theme tokens ──────────────────────────────────────────
        void:       "#070A13",           // page background
        surface:    { DEFAULT: "#0F1623", hi: "#151D2E", elevated: "#1A2235" },
        border:     { DEFAULT: "#1E2A3D", hi: "#2A3B56", glow: "#22D3EE33" },
        prose:      { DEFAULT: "#CBD5E1", soft: "#64748B", bright: "#E2E8F0" },
        accent:     { DEFAULT: "#22D3EE", dark: "#0891B2", light: "#67E8F9", glow: "rgba(34,211,238,0.15)" },
        violet:     { DEFAULT: "#818CF8", dark: "#6366F1", light: "#A5B4FC", glow: "rgba(129,140,248,0.15)" },
        success:    { DEFAULT: "#34D399", glow: "rgba(52,211,153,0.15)" },
        warning:    { DEFAULT: "#FBBF24", glow: "rgba(251,191,36,0.15)" },
        danger:     { DEFAULT: "#F87171", glow: "rgba(248,113,113,0.15)" },
        // ── Legacy light-theme tokens (kept for zero breakage) ─────────
        ink:  { DEFAULT: "#14262B", soft: "#42565B" },
        mist: "#EEF3F2",
        line: "#D5E0DE",
        tide: { DEFAULT: "#17636B", dark: "#0F4A51", light: "#DDEEEC" },
        sun:  "#E3A33B",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans:    ["var(--font-body)",    "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card:         "0 1px 2px rgba(20,38,43,.06), 0 8px 24px -12px rgba(20,38,43,.18)",
        "dark-card":  "0 0 0 1px #1E2A3D, 0 4px 24px -8px rgba(0,0,0,.6)",
        "glow-accent":"0 0 20px rgba(34,211,238,0.2), 0 0 40px rgba(34,211,238,0.08)",
        "glow-violet":"0 0 20px rgba(129,140,248,0.2), 0 0 40px rgba(129,140,248,0.08)",
        "glow-sm":    "0 0 10px rgba(34,211,238,0.25)",
      },
      backgroundImage: {
        "gradient-radial":  "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":   "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "grid-pattern":     "linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-sm": "40px 40px",
      },
      animation: {
        "fade-up":     "fadeUp .45s ease-out both",
        "fade-in":     "fadeIn .35s ease-out both",
        "blob-drift":  "blobDrift 12s ease-in-out infinite",
        "blob-drift2": "blobDrift2 15s ease-in-out infinite",
        "pulse-glow":  "pulseGlow 2.5s ease-in-out infinite",
        "spin-slow":   "spin 3s linear infinite",
        "bounce-x":    "bounceX .6s ease-in-out infinite",
        "ring-draw":   "ringDraw 1.1s cubic-bezier(.2,.7,.2,1) .1s both",
        "number-pop":  "numberPop .4s cubic-bezier(.34,1.56,.64,1) both",
        "slide-down":  "slideDown .25s ease-out both",
      },
      keyframes: {
        fadeUp:    { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "none" } },
        fadeIn:    { from: { opacity: "0" }, to: { opacity: "1" } },
        blobDrift: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%":     { transform: "translate(40px,-30px) scale(1.07)" },
          "66%":     { transform: "translate(-20px,20px) scale(0.96)" },
        },
        blobDrift2: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%":     { transform: "translate(-50px,25px) scale(1.05)" },
          "66%":     { transform: "translate(30px,-15px) scale(0.98)" },
        },
        pulseGlow: {
          "0%,100%": { opacity: "0.6" },
          "50%":     { opacity: "1" },
        },
        bounceX: {
          "0%,100%": { transform: "translateX(0)" },
          "50%":     { transform: "translateX(4px)" },
        },
        ringDraw:   { from: { strokeDashoffset: "var(--ring-len)" }, to: { strokeDashoffset: "0" } },
        numberPop:  { from: { opacity: "0", transform: "scale(0.7)" }, to: { opacity: "1", transform: "scale(1)" } },
        slideDown:  { from: { opacity: "0", transform: "translateY(-8px)" }, to: { opacity: "1", transform: "none" } },
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(.34,1.56,.64,1)",
      },
    },
  },
  plugins: [],
};

export default config;
