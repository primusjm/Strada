module.exports = {
  content: [
    "./_includes/**/*.html",
    "./_layouts/**/*.html",
    "./_posts/*.html",
    "./_studios/*.md",
    "./_data/*.html",
    "./*.html",
  ],
  theme: {
    extend: {
      colors: {
        black: "#050505",
        white: "#ffffff",
        charcoal: "#4A556C",
        cream: "#FAF8F6",
        stroke: "#EDEFF5",
        green: "#00A651",
        blue: "#1565C0",
        teal: "#20AD96",
        yellow: "#F9A825",
      },
      fontFamily: {
        sans: ["KumbhSans"],
        serif: ["KumbhSans"],
        display: ["KumbhSans"],
      },
      animation: {
        "loop-scroll": "loop-scroll 50s linear infinite",
      },
      keyframes: {
        "loop-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
  variants: {
    extend: {},
  },
};
