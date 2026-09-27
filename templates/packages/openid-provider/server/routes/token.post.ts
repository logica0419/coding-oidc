interface TokenInput {
  grantType: string;
  code: string;
  clientId: string;
}

// TODO: Phase 1: OAuth
// TODO: Phase 3: PKCE
// TODO: Phase 4: OIDC
const tokenLogic = async (input: TokenInput): Promise<TokenResponse> => {
  return {
    access_token: "",
    token_type: "Bearer",
    expires_in: 0,
  };
};

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as Record<string, unknown>;

    const input: TokenInput = {
      grantType: pickString(body, "grant_type"),
      code: pickString(body, "code"),
      clientId: pickString(body, "client_id"),
    };

    return await tokenLogic(input);
  } catch (error) {
    return handleError(event, error);
  }
});
