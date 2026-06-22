import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#F7F3EC",
        card: "#FFFFFF",
        "text-primary": "#1E1E1E",
        primary: "#2A2521",
        accent: "#C8A45D",
        success: "#2E7D32",
        warning: "#D89B00",
        danger: "#C0392B",
        border: "#E5DED2",
        muted: "#8A7E72",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
