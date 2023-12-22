export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {},
    fontFamily: {
      title: ["Pacifico"],
      body: ["Montserrat"],
    },
  },
  plugins: [require("daisyui"), require("flowbite/plugin")],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
};
