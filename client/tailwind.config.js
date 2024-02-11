const {nextui} = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content:["./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    purge: ['./src/**/*.{js,ts,jsx,tsx}', './public/index.html'],
  },
  darkMode: "class",
  plugins: [nextui()],
}

