export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  ssr: false,
  devServer: { host: "0.0.0.0" },
  css: ["~/assets/main.css"],
  modules: ["@vizejs/nuxt"],
  nitro: {
    routeRules: {
      "/.well-known/jwks.json": { proxy: "/well-known/jwks.json" },
    },
  },
});
