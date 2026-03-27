

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",       // scan all pages
    "./components/**/*.{js,ts,jsx,tsx}",  // scan all components
    "./app/**/*.{js,ts,jsx,tsx}",         // if using Next.js App Router
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ["'Syne'", "sans-serif"],  
      },
    //   colors: {
    //     // optionally, add custom colors
    //     background: "var(--background)",
    //     foreground: "var(--foreground)",
    //   },
    },
  },
  plugins: [],
};