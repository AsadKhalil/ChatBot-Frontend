/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          main: "#0755E9",
          600: "#4E29A3",
          500: "#6133CC",
          400: "#815CD6",
          50: "#EFEBFA",
          25: "#FAF9FD",
        },
        grey: {
          900: "#101828",
          800: "#313335",
          500: "#7A7E85",
          100: "#E4E5E7",
          50: "#F1F1F2",
          25: "#FAFAFA",
          15: "rgba(248, 248, 248, 1)",
        },
        white: {
          900: "#fff",
          800: "#F8F8F8",
          700: "#E4E5E7",
          300: "rgba(255, 255, 255, 0.3)",
        },
        blue: {
          200: "#F4F7FE",
          300: "#D3E1FA",
          400: "#E4EDFC",
          500: "#E9F0FC",
          600: "#E6EFFF",
          700: "#F6F8FF",
        },
        black: {
          900: "#1B232E",
          800: "#18191B",
          700: "#191f29",
        },
        secondary: {
          main: "#D5D4D4",
          900: "#273343",
        },
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant(
        "group-data-state-active",
        ({ modifySelectors, separator }) => {
          modifySelectors(({ className }) => {
            return `.group[data-state="active"] .${className}`;
          });
        }
      );
    },
  ],
};
