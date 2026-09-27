import type { H3Event } from "h3";

// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
const authorizationUrlLogic = async (event: H3Event): Promise<AuthorizationUrlResponse> => {
  const authorizeUrl = new URL("http://localhost:3101/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", "rp-demo");
  authorizeUrl.searchParams.set("scope", "example");

  return { authorizeUrl: authorizeUrl.toString() };
};

export default defineEventHandler((event) => {
  return authorizationUrlLogic(event);
});
