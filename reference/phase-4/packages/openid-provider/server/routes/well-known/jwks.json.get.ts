// TODO: Phase 4: OIDC
const jwksLogic = async (): Promise<JwksDocument> => {
  return getJWTPublicKey();
};

export default defineEventHandler(() => {
  return jwksLogic();
});
