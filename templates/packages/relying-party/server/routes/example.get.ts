import type { H3Event } from "h3";

// TODO: Phase 1: OAuth
const exampleProxyLogic = async (event: H3Event): Promise<ExampleResponse> => {
  const session = await getUserSession(event);

  return getRequest<ExampleResponse>("http://localhost:3001/api/example", {
    Authorization: `Bearer ${session.accessToken}`,
  });
};

export default defineEventHandler((event) => {
  return exampleProxyLogic(event);
});
