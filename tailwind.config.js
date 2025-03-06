/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto-Regular', 'serif'],
        "roboto-bold": ['Roboto-Bold', 'serif'],
        unbounded: ['Unbounded-Regular', 'serif'],
      },
      colors: {
        "black": "#141414",
        "white": "#FFFFFF",
        "grey": "#878787",
        "blue": "#2D5BFF",
        "red": "#FF2323",
        "yellow": "#FFD400",
      }
    },
  },
  plugins: [],
}