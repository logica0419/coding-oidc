interface LoginOutput {
  authorizeUrl: string;
}

// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
// TODO: Phase 5: nonce
// TODO: Phase 6: OIDC Discovery Endpoint
const loginLogic = async (): Promise<LoginOutput> => {
  const state = randomString(16);
  const nonce = randomString(16);
  const codeVerifier = randomString(64);
  const codeChallenge = base64EncodeBytes(createHash(codeVerifier));
  await setLoginState(state, { codeVerifier, nonce });
  const authorizeUrl = new URL(`${OP_ISSUER}/authorize`);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", CLIENT_ID);
  authorizeUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authorizeUrl.searchParams.set("scope", SCOPES);
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("code_challenge", codeChallenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");
  return { authorizeUrl: authorizeUrl.toString() };
};

export default defineEventHandler(async () => {
  try {
    return await loginLogic();
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : "login failed",
    });
  }
});
