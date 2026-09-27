import type { H3Event } from "h3";

// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
const authorizationUrlLogic = async (event: H3Event): Promise<AuthorizationUrlResponse> => {
  return { authorizeUrl: "" };
};

export default defineEventHandler((event) => {
  return authorizationUrlLogic(event);
});
