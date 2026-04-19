import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-elevated": "var(--bg-elevated)",
        "bg-muted": "var(--bg-muted)",
        "bg-sunken": "var(--bg-sunken)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        muted: "var(--muted)",
        "muted-2": "var(--muted-2)",
        line: "var(--line)",
        "line-soft": "var(--line-soft)",
        "line-strong": "var(--line-strong)",
        forest: "var(--forest)",
        "forest-2": "var(--forest-2)",
        "forest-soft": "var(--forest-soft)",
        "forest-text": "var(--forest-text)",
        saffron: "var(--saffron)",
        "saffron-2": "var(--saffron-2)",
        "saffron-soft": "var(--saffron-soft)",
        "saffron-text": "var(--saffron-text)",
        rose: "var(--rose)",
        "rose-soft": "var(--rose-soft)",
        lime: "var(--lime)",
        "lime-bright": "var(--lime-bright)",
      },
      fontFamily: {
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        hand: ["var(--font-caveat)", "cursive"],
      },
      boxShadow: {
        card: "var(--shadow-card)",
        float: "var(--shadow-float)",
        browser: "var(--shadow-browser)",
        lift: "var(--shadow-lift)",
        stamp: "var(--shadow-stamp)",
      },
    },
  },
  plugins: [],
} satisfies Config;
