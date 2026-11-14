import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090a0f",
        foreground: "#f0f2f8",
        card: "#121420",
        "card-hover": "#1a1d2e",
        accent: {
          cyan: "#00f0ff",
          purple: "#9d4edd",
          pink: "#ff007f",
          amber: "#ffb703"
        }
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 12s linear infinite",
      }
    },
  },
  plugins: [],
};
export default config;

