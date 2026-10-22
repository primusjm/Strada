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
      screens: {
        nav: "1100px",
      },
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
        ink: "var(--green-ink)",
      },
      fontSize: {
        display: ["clamp(2.5rem, 1.9rem + 2.6vw, 4rem)", { lineHeight: "1.08" }],
        heading: ["clamp(1.75rem, 1.4rem + 1.1vw, 2.25rem)", { lineHeight: "1.15" }],
      },
      boxShadow: {
        card: "0px 1px 3px 0px rgba(0, 0, 0, 0.16)",
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
