import { createRootRoute } from "@tanstack/vue-router";

export const Route = createRootRoute({
  head: () => ({
    meta: [{ charSet: "utf-8" }, { title: "OpenID Provider" }],
  }),
});
