import { createFileRoute } from "@tanstack/vue-router";

export const Route = createFileRoute("/auth/login")({
  server: {
    handlers: {
      // TODO: create state + PKCE pair, redirect to OP authorize
      GET: () => new Response("TODO: login", { status: 501 }),
    },
  },
});
