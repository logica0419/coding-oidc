import { createFileRoute } from "@tanstack/vue-router";

export const Route = createFileRoute("/discovery")({
  server: {
    handlers: {
      // TODO: return OIDC discovery document at /discovery (workshop simplification of /.well-known/openid-configuration)
      GET: () => new Response("TODO: discovery", { status: 501 }),
    },
  },
});
