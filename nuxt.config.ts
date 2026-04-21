import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  typescript: {
    strict: true,
  },
  vite: {
    plugins: [tailwindcss() as any],
  },
  runtimeConfig: {
    jwtSecret: "",
    public: {
      appName: "Babyfoot Tournament Manager",
    },
  },
});
