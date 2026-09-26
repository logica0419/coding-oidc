interface UserinfoOutput {
  sub: string;
  name: string;
}

// TODO: Phase 4: OIDC
const userinfoLogic = async (authorization: string | undefined): Promise<UserinfoOutput> => {
  if (authorization === undefined || !authorization.startsWith("Bearer ")) {
    throw new Error("missing bearer token");
  }
  const claims = await verifyAccessToken(authorization.slice("Bearer ".length));
  const user = await findUser(claims.sub);
  return { sub: user.id, name: user.name };
};

export default defineEventHandler(async (event) => {
  try {
    return await userinfoLogic(getHeader(event, "authorization"));
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: error instanceof Error ? error.message : "unauthorized",
    });
  }
});
