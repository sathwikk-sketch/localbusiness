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
        // Primary ink - sophisticated navy
        ink: {
          DEFAULT: "#0f172a",
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617"
        },
        // Mint - premium teal accent
        mint: {
          DEFAULT: "#0d9488",
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e"
        },
        // Saffron - warm accent
        saffron: {
          DEFAULT: "#f59e0b",
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03"
        },
        // Rose - subtle accent for alerts/discounts
        rose: {
          DEFAULT: "#e11d48",
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
          950: "#4c0519"
        },
        // Neutral paper tones
        paper: {
          DEFAULT: "#fafafa",
          50: "#ffffff",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a"
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif"
        ],
        serif: [
          "Georgia",
          "Times New Roman",
          "serif"
        ],
        display: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ]
      },
      fontSize: {
        // Refined type scale
        "display-xl": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "300" }],
        "display-lg": ["3.75rem", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "400" }],
        "display-md": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.015em", fontWeight: "500" }],
        "display-sm": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" }],
        "heading-xl": ["1.875rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
        "heading-lg": ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.005em", fontWeight: "600" }],
        "heading-md": ["1.25rem", { lineHeight: "1.3", letterSpacing: "0", fontWeight: "600" }],
        "heading-sm": ["1.125rem", { lineHeight: "1.35", letterSpacing: "0", fontWeight: "600" }],
        "body-xl": ["1.125rem", { lineHeight: "1.7", letterSpacing: "0.01em", fontWeight: "400" }],
        "body-lg": ["1rem", { lineHeight: "1.65", letterSpacing: "0.01em", fontWeight: "400" }],
        "body-md": ["0.9375rem", { lineHeight: "1.6", letterSpacing: "0.01em", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.55", letterSpacing: "0.01em", fontWeight: "400" }],
        "label": ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.025em", fontWeight: "500" }],
        "caption": ["0.75rem", { lineHeight: "1.35", letterSpacing: "0.03em", fontWeight: "400" }],
        "overline": ["0.6875rem", { lineHeight: "1.3", letterSpacing: "0.08em", fontWeight: "600" }]
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
        "38": "9.5rem"
      },
      boxShadow: {
        "subtle": "0 1px 2px rgba(0, 0, 0, 0.04)",
        "soft": "0 2px 4px rgba(0, 0, 0, 0.02), 0 4px 12px rgba(0, 0, 0, 0.04)",
        "elevated": "0 4px 6px rgba(0, 0, 0, 0.02), 0 12px 24px rgba(0, 0, 0, 0.06)",
        "glass": "0 8px 32px rgba(15, 23, 42, 0.08)",
        "premium": "0 12px 40px rgba(15, 23, 42, 0.12)",
        "glow": "0 0 40px rgba(13, 148, 136, 0.15)",
        "inner-glow": "inset 0 1px 1px rgba(255, 255, 255, 0.5)"
      },
      borderRadius: {
        "sm": "0.25rem",
        "md": "0.5rem",
        "lg": "0.75rem",
        "xl": "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "4xl": "2rem"
      },
      transitionTimingFunction: {
        "premium": "cubic-bezier(0.4, 0, 0.2, 1)",
        "smooth": "cubic-bezier(0.25, 0.1, 0.25, 1)",
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
      },
      transitionDuration: {
        "250": "250ms",
        "350": "350ms",
        "450": "450ms"
      },
      backdropBlur: {
        "xs": "2px"
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
