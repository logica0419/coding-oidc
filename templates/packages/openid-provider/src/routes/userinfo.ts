import { createFileRoute } from "@tanstack/vue-router";

export const Route = createFileRoute("/userinfo")({
  server: {
    handlers: {
      // TODO: verify access token, return profile claims
      GET: () => new Response("TODO: userinfo", { status: 501 }),
    },
  },
});
