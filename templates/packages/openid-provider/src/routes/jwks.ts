import { createFileRoute } from "@tanstack/vue-router";

export const Route = createFileRoute("/jwks")({
  server: {
    handlers: {
      // TODO: expose ES256 public key as JWKS
      GET: () => new Response("TODO: jwks", { status: 501 }),
    },
  },
});
