/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#0a0f18",
        surface: "#121927",
        surfaceHover: "#1a2333",
        primary: "#10b981",
        primaryHover: "#059669",
        danger: "#ef4444",
        warning: "#f59e0b",
        textPrimary: "#f8fafc",
        textSecondary: "#94a3b8",
        glass: "rgba(18, 25, 39, 0.7)",
        glassBorder: "rgba(255, 255, 255, 0.1)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};
