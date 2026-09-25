import handler from "@tanstack/vue-start/server-entry";
import { toNodeHandler } from "srvx/node";
import http from "node:http";

const port = Number(process.env.PORT ?? 3101);

http.createServer(toNodeHandler(handler.fetch)).listen(port, () => {
  console.log(`openid-provider listening on http://localhost:${port}`);
});
