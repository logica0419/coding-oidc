interface MeOutput {
  sub: string;
  name: string;
}

// TODO: Phase 4: OIDC
const meLogic = async (): Promise<MeOutput> => {
  return { sub: "user1", name: "ユーザー1" };
};

export default defineEventHandler(async () => {
  try {
    return await meLogic();
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : "me failed",
    });
  }
});
