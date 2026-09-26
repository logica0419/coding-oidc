interface ConsentInput {
  clientId: string;
  redirectUri: string;
  scope: string;
  state: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  userId: string;
}

interface ConsentOutput {
  redirectTo: string;
}

// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
const consentLogic = async (body: Record<string, unknown>): Promise<ConsentOutput> => {
  const pick = (name: string): string => {
    const value = body[name];
    if (typeof value !== "string" || value === "") {
      throw new Error(`missing ${name}`);
    }
    return value;
  };
  const input: ConsentInput = {
    clientId: pick("client_id"),
    redirectUri: pick("redirect_uri"),
    scope: pick("scope"),
    state: pick("state"),
    codeChallenge: pick("code_challenge"),
    codeChallengeMethod: pick("code_challenge_method"),
    userId: pick("user_id"),
  };
  if (input.clientId !== CLIENT_ID) {
    throw new Error("unknown client_id");
  }
  const user = await findUser(input.userId);
  const code = randomString(32);
  await setAuthCode(code, {
    clientId: input.clientId,
    redirectUri: input.redirectUri,
    scope: input.scope,
    state: input.state,
    codeChallenge: input.codeChallenge,
    codeChallengeMethod: input.codeChallengeMethod,
    sub: user.id,
  });
  const redirect = new URL(input.redirectUri);
  redirect.searchParams.set("code", code);
  redirect.searchParams.set("state", input.state);
  return { redirectTo: redirect.toString() };
};

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as Record<string, unknown>;
    return await consentLogic(body);
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error instanceof Error ? error.message : "invalid request",
    });
  }
});
