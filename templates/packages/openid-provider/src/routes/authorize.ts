import { createFileRoute } from "@tanstack/vue-router";

export const Route = createFileRoute("/authorize")({
  server: {
    handlers: {
      // TODO: validate query, show consent, issue code into Valkey
      GET: () => new Response("TODO: authorize", { status: 501 }),
    },
  },
});
