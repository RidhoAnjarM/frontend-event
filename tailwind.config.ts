import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'custom-purple-1-100': '#10107B',
        'custom-purple-2-100': '#10107B',
        'custom-purple': '#7848F4',
        'custom-purple-light': '#10107B',
        'custom-navy': '#10107B',
        'custom-grey': '#ECECEC',
      },
      fontFamily: {
        russo: ['Russo One'],
      },
      boxShadow: {
        'custom': '0 0 15px rgba(0, 0, 0, 100)',
        'custom-dua': '0 0 10px rgba(0, 0, 0, 20)',
      },
      animation: {
        loader3: "loader3 3s ease-in-out infinite",
      },
      keyframes: {
        loader3: {
          "0%": { transform: "scaleY(1)" },
          "20%": { transform: "scaleY(2.32)" },
          "40%": { transform: "scaleY(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
