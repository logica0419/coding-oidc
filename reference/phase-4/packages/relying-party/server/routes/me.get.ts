import type { H3Event } from "h3";

// TODO: Phase 4: OIDC
const meLogic = async (event: H3Event): Promise<MeResponse> => {
  const session = await getUserSession(event);

  return { sub: session.id, name: session.name };
};

export default defineEventHandler((event) => {
  return meLogic(event);
});
