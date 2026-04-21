import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/components/**/*.{vue,js,ts}",
    "./app/pages/**/*.vue",
    "./app/layouts/**/*.vue",
    "./app/app.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
