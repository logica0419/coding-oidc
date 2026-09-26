export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devServer: { host: "0.0.0.0" },
  css: ["~/assets/main.css"],
  modules: ["@vizejs/nuxt"],
  vize: {
    compiler: false,
  },
});
