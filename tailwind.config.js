/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        system: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Helvetica Neue",
          "Segoe UI",
          "Inter",
          "sans-serif",
        ],
        mono: ["SF Mono", "ui-monospace", "Menlo", "Monaco", "monospace"],
      },
    },
  },
  plugins: [],
};
