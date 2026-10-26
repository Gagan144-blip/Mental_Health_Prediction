import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#14262B", soft: "#42565B" },
        mist: "#EEF3F2",
        line: "#D5E0DE",
        tide: { DEFAULT: "#17636B", dark: "#0F4A51", light: "#DDEEEC" },
        sun: "#E3A33B",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,38,43,.06), 0 8px 24px -12px rgba(20,38,43,.18)",
      },
    },
  },
  plugins: [],
};
export default config;
