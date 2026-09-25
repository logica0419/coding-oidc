import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/vue-start/plugin/vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  server: {
    port: 3100,
  },
  plugins: [tanstackStart(), vue(), vueJsx()],
});
