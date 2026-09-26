interface TokenInput {
  grantType: string;
  code: string;
  redirectUri: string;
  clientId: string;
  codeVerifier: string;
}

interface TokenOutput {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  id_token: string;
}

// TODO: Phase 1: OAuth
// TODO: Phase 3: PKCE
// TODO: Phase 4: OIDC
// TODO: Phase 5: nonce
const tokenLogic = async (body: Record<string, unknown>): Promise<TokenOutput> => {
  const pick = (name: string): string => {
    const value = body[name];
    if (typeof value !== "string" || value === "") {
      throw new Error(`missing ${name}`);
    }
    return value;
  };
  const input: TokenInput = {
    grantType: pick("grant_type"),
    code: pick("code"),
    redirectUri: pick("redirect_uri"),
    clientId: pick("client_id"),
    codeVerifier: pick("code_verifier"),
  };
  if (input.grantType !== "authorization_code") {
    throw new Error("unsupported grant_type");
  }
  if (input.clientId !== CLIENT_ID) {
    throw new Error("unknown client_id");
  }
  const stored = await getAuthCode(input.code);
  if (stored.clientId !== input.clientId || stored.redirectUri !== input.redirectUri) {
    throw new Error("invalid grant");
  }
  const expected = base64EncodeBytes(createHash(input.codeVerifier));
  if (expected !== stored.codeChallenge) {
    throw new Error("invalid code_verifier");
  }
  await deleteAuthCode(input.code);
  const user = await findUser(stored.sub);
  const accessToken = await createAccessToken({ sub: user.id, scope: stored.scope });
  const idToken = await createIdToken({ sub: user.id, name: user.name });
  return {
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_TTL_SEC,
    id_token: idToken,
  };
};

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as Record<string, unknown>;
    return await tokenLogic(body);
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error instanceof Error ? error.message : "invalid grant",
    });
  }
});
