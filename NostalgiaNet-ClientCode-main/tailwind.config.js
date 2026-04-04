/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      Khyay: ["Khyay", "sans-serif"],
      ABeeZee: ["ABeeZee", "sans-serif"],
      SourceSans: ["Source Sans 3", "sans-serif"],
      Inter: ["Inter", "sans-serif"],
      Poppins: ["Poppins", "sans-serif"],
      SpaceMono: ["Space Mono","sans-serif"]
    },
    extend: {
      screens: {
        "h-sm": { raw: "(min-height: 600px)" }, // Height >= 600px
        "h-md": { raw: "(min-height: 768px)" }, // Height >= 768px
        "h-lg": { raw: "(min-height: 900px)" }, // Height >= 900px
        "h-xl": { raw: "(min-height: 1080px)" }, // Height >= 1080px
      },
    },
  },
  plugins: [],
};
