interface TokenInput {
  grantType: string;
  code: string;
  clientId: string;
  codeVerifier: string;
}

// TODO: Phase 1: OAuth
// TODO: Phase 3: PKCE
// TODO: Phase 4: OIDC
const tokenLogic = async (input: TokenInput): Promise<TokenResponse> => {
  if (input.grantType !== "authorization_code") {
    throw new Error("unsupported_grant_type");
  }

  if (input.clientId !== "rp-demo") {
    throw new Error("invalid_client");
  }

  if (input.code === "") {
    throw new Error("invalid_request");
  }

  let stored: AuthCodePayload;
  try {
    stored = await getAuthCode(input.code);
  } catch {
    throw new Error("invalid_grant");
  }

  if (stored.clientId !== input.clientId) {
    throw new Error("invalid_grant");
  }

  await deleteAuthCode(input.code);

  const user = await findUser(stored.id);
  const accessToken = await createAccessToken({ sub: user.id, scope: stored.scope.join(" ") });

  return {
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_TTL_SEC,
  };
};

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as Record<string, unknown>;

    const input: TokenInput = {
      grantType: pickString(body, "grant_type"),
      code: pickString(body, "code"),
      clientId: pickString(body, "client_id"),
      codeVerifier: pickString(body, "code_verifier"),
    };

    return await tokenLogic(input);
  } catch (error) {
    return handleError(event, error);
  }
});
