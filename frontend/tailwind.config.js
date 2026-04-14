/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        surface: {
          DEFAULT: "#ffffff",
          dark:    "#0f172a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in":   "fadeIn .4s ease both",
        "slide-up":  "slideUp .4s ease both",
        "slide-in":  "slideIn .35s ease both",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: "translateY(20px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        slideIn: { from: { opacity: 0, transform: "translateX(-16px)" }, to: { opacity: 1, transform: "translateX(0)" } },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / .06), 0 1px 2px -1px rgb(0 0 0 / .04)",
        "card-hover": "0 10px 25px -5px rgb(0 0 0 / .08), 0 4px 10px -6px rgb(0 0 0 / .04)",
        glow: "0 0 0 3px rgb(59 130 246 / .35)",
      },
    },
  },
  plugins: [],
};
