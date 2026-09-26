interface CodeInput {
  code: string;
  state: string;
}

interface CodeOutput {
  message: string;
}

// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
// TODO: Phase 4: OIDC
const codeLogic = async (body: Record<string, unknown>): Promise<CodeOutput> => {
  const pick = (name: string): string => {
    const value = body[name];
    if (typeof value !== "string" || value === "") {
      throw new Error(`missing ${name}`);
    }
    return value;
  };
  const input: CodeInput = { code: pick("code"), state: pick("state") };
  const loginState = await getLoginState(input.state);
  await deleteLoginState(input.state);
  const token = await postForm<TokenResponse>(`${OP_ISSUER}/token`, {
    grant_type: "authorization_code",
    code: input.code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: loginState.codeVerifier,
  });
  const jwks = await getRequest<JwksDocument>(`${OP_ISSUER}/jwks`);
  const claims = await verifyIdToken(token.id_token, jwks.keys[0]);
  const sessionId = randomString(32);
  await setStoredSession(sessionId, { sub: claims.sub, name: claims.name });
  return { message: "交換できました！" };
};

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as Record<string, unknown>;
    return await codeLogic(body);
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error instanceof Error ? error.message : "code exchange failed",
    });
  }
});
