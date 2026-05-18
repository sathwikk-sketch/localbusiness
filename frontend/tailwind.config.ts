import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14213d",
        mint: "#1fb98b",
        saffron: "#ffb703",
        rose: "#e85d75",
        paper: "#f8fafc"
      },
      boxShadow: {
        soft: "0 24px 80px rgba(15, 23, 42, 0.14)",
        glass: "0 18px 60px rgba(15, 23, 42, 0.18)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
