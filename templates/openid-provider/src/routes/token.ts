import { createFileRoute } from "@tanstack/vue-router";

export const Route = createFileRoute("/token")({
  server: {
    handlers: {
      // TODO: verify code + PKCE, issue ES256 access/id tokens
      POST: () => new Response("TODO: token", { status: 501 }),
    },
  },
});
