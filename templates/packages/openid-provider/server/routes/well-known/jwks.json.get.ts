// TODO: Phase 4: OIDC
const jwksLogic = async (): Promise<JwksDocument> => {
  return { keys: [] };
};

export default defineEventHandler(() => {
  return jwksLogic();
});
