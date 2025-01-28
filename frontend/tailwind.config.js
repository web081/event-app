//  // tailwind.config.js

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      colors: {
        transparent: "transparent",
        current: "currentColor",
        Blud: "#D50F3E",
        hoverBtn: "#ba206c",
        btColour: "#ba206c",
        HeroClr: "#8c3d86",
        textClr: "#1277e9",
        green: "#00D121",
        white: "#ffffff",
        purple: "#8400AB",
        purple2: "#7402BA",
        dark: "#000000",
        customBlack: "#201F1F",

        extend: {},
      },
      screens: {
        xs: "400px",
        sm: "640px",
        // => @media (min-width: 640px) { ... }
        md: "768px",
        // => @media (min-width: 768px) { ... }
        lg: " 1024px",
        // => @media (min-width: 1024px) { ... }
        xl: "1280px",
        // => @media (min-width: 1280px) { ... }
        "2xl": "1536px",
        // // => @media (min-width: 1536px) { ... }
        mod: { max: "639px" },
        expcard: { max: "1066px" },
        minilg: { min: "899px" },
        maxlg: { max: "900px" },
        mid: { max: "767px" },
        Nlg: { max: "1023px" },
        // => @media (min-width: 0px and max-width: 639px) { ... }
      },

      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        "montserrat-subrayada": ["Montserrat Subrayada", "sans-serif"],
        // Defined Montserrat and Montserrat Subrayada fonts
      },
      keyframes: {
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        "slide-in-right": "slide-in-right 0.3s ease-out",
      },
    },
  },
  variants: {
    extend: {
      transitionProperty: ["responsive", "hover", "focus"],
      translate: ["responsive", "hover", "focus"],
    },
  },
  plugins: [require("flowbite/plugin")],
};
