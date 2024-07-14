import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "2xs": "0.775rem",
        "3xs": "0.675rem",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["sunset"],
  },
};
