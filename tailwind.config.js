module.exports = {
  purge: ["./src/**/*.vue", "./src/**/*.less"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      minWidth: {
        "24": "6rem"
      },
      minHeight: {
        "60": "15rem",
        "96": "24rem"
      }
    }
  },
  variants: {
    outline: ["responsive"],
    extend: {
      margin: ["first"]
    }
  },
  plugins: []
};
