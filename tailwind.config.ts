import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vazirmatn", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        aura: "0 30px 90px rgba(98, 67, 40, 0.16)",
        soft: "0 18px 50px rgba(98, 67, 40, 0.10)",
      },
      colors: {
        pearl: "#fffaf4",
        champagne: "#ecd4a3",
        gold: "#c9954e",
        rose: "#d88998",
        ink: "#2e2119",
      },
    },
  },
  plugins: [],
};
export default config;
