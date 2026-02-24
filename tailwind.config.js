module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // This 'patua' key is what you'll use in your className (e.g., font-patua)
        patua: ["var(--font-patua)", "serif"],
        lora: ["Lora", "serif"],
      },
    },
  },
  plugins: [],
};
