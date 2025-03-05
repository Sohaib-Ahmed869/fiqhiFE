/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
        // now 'font-sans' will use Outfit by default
      },
      colors: {
        primary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857", // Main primary color
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#081834", // Main secondary color
          900: "#0f172a",
          950: "#020617",
        },
      },

      borderRadius: {
        DEFAULT: "0.375rem",
      },
      boxShadow: {
        input: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#047857",
          "primary-focus": "#065f46",
          "primary-content": "#ffffff",
          secondary: "#081834",
          "secondary-focus": "#0f172a",
          "secondary-content": "#ffffff",
          accent: "#047857",
          neutral: "#2a323c",
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#d1d5db",
          "base-content": "#1f2937",
        },
      },
    ],
  },
};
