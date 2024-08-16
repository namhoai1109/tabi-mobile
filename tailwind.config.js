/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors")

const defaultColor = colors

module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/screens/**/*.{js,jsx,ts,tsx}",
    "./app/screens/**/**/*.{js,jsx,ts,tsx}",
    "./app/component/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      ...defaultColor,

      dark: "#1F1D2B",
      light: "#FAFAFA",
      grey: "#ABBBC2",
      transparent: "transparent",
      current: "currentColor",

      "grey-darker": "#9B9D9E",
      "base-bg-light": "#FAFAFA",
      "base-bg-dark": "#1F1D2B",
      "base-bg-white": "#FFFFFC",
      "base-bg-black": "#000D0B",
      "base-bg-neutral": "#252836",

      "primary-dominant": "#F5566C",
      "primary-dominant-light": "#FF7B8F",
      "primary-dominant-lighter": "#FFF0F0",
      "primary-dominant-dark": "#D84152",

      "primary-accent": "#5EE2F0",
      "primary-accent-light": "#8FE6F4",
      "primary-accent-dark": "#6FE2EF",

      "text-light": "#FFFFFC",
      "text-dark": "#1F1D2B",

      "color-error": "#E43151",
      "color-success": "#9EE493",
      "in-review": "#0e7c7b",
    },
  },
  plugins: [],
}
