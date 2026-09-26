interface JwksOutput {
  keys: Record<string, unknown>[];
}

// TODO: Phase 6: OIDC Discovery Endpoint
const jwksLogic = async (): Promise<JwksOutput> => {
  return getJWTPublicKey();
};

export default defineEventHandler(async () => {
  try {
    return await jwksLogic();
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : "jwks failed",
    });
  }
});
