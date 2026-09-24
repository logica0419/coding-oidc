import { createFileRoute } from "@tanstack/vue-router";

export const Route = createFileRoute("/auth/userinfo")({
  server: {
    handlers: {
      // TODO: call OP userinfo with stored access token
      GET: () => new Response("TODO: userinfo proxy", { status: 501 }),
    },
  },
});
