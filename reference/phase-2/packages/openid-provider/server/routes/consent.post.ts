interface ConsentInput {
  responseType: string;
  clientId: string;
  scope: string;
  state: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  userId: string;
}

// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
const consentLogic = async (input: ConsentInput): Promise<ConsentResponse> => {
  if (input.responseType !== "code") {
    throw new Error("unsupported_response_type");
  }

  if (input.clientId !== "rp-demo") {
    throw new Error("invalid_client");
  }

  if (input.state === "") {
    throw new Error("invalid_request");
  }

  const scopes = input.scope.split(" ").filter((scope) => scope !== "");
  if (scopes.some((scope) => !["example"].includes(scope))) {
    throw new Error("invalid_scope");
  }

  if (input.userId === "") {
    throw new Error("invalid_request");
  }

  const user = await findUser(input.userId);
  const code = randomString(32);

  await setAuthCode(code, {
    clientId: input.clientId,
    scope: scopes,
    state: input.state,
    id: user.id,
  });

  const redirect = new URL("http://localhost:3200/callback");
  redirect.searchParams.set("code", code);
  redirect.searchParams.set("state", input.state);

  return { redirectTo: redirect.toString() };
};

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as Record<string, unknown>;

    const input: ConsentInput = {
      responseType: pickString(body, "response_type"),
      clientId: pickString(body, "client_id"),
      scope: pickString(body, "scope"),
      state: pickString(body, "state"),
      codeChallenge: pickString(body, "code_challenge"),
      codeChallengeMethod: pickString(body, "code_challenge_method"),
      userId: pickString(body, "user_id"),
    };

    return await consentLogic(input);
  } catch (error) {
    return handleError(event, error);
  }
});
