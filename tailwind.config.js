/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: "Roboto, sans-serif",
      },
      colors: {
        orange: {
            500: "#F27329",
            400: "#D48744"
        },
        black: "#0D0D0D",
      },
      purple: {
        600:"#1D0259",
        700:"#14023e",
        800:"#0e012c",
      },
      },
    },
  
  plugins: [],
};
