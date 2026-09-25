import handler from "@tanstack/vue-start/server-entry";
import { toNodeHandler } from "srvx/node";
import http from "node:http";

const port = Number(process.env.PORT ?? 3100);

http.createServer(toNodeHandler(handler.fetch)).listen(port, () => {
  console.log(`relying-party listening on http://localhost:${port}`);
});
