import type { H3Event } from "h3";

// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
const authorizationUrlLogic = async (event: H3Event): Promise<AuthorizationUrlResponse> => {
  const state = randomString(16);

  await setAuthRequest(event, { state });

  const authorizeUrl = new URL("http://localhost:3201/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", "rp-demo");
  authorizeUrl.searchParams.set("scope", "example");
  authorizeUrl.searchParams.set("state", state);

  return { authorizeUrl: authorizeUrl.toString() };
};

export default defineEventHandler((event) => {
  return authorizationUrlLogic(event);
});
