import type { H3Event } from "h3";

interface ExchangeInput {
  code: string;
  state: string;
}

// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
// TODO: Phase 4: OIDC
const exchangeLogic = async (event: H3Event, input: ExchangeInput): Promise<ExchangeResponse> => {
  if (input.code === "" || input.state === "") {
    throw new Error("missing code or state");
  }

  const authRequest = await getAuthRequest(event);
  if (authRequest.state !== input.state) {
    throw new Error("invalid state");
  }

  await deleteAuthRequest(event);

  const token = await postRequest<TokenResponse>(
    "http://localhost:3401/token",
    {
      grant_type: "authorization_code",
      code: input.code,
      client_id: "rp-demo",
      code_verifier: authRequest.codeVerifier ?? "",
    },
    true,
  );
  if (token.id_token === undefined) {
    throw new Error("missing id_token");
  }

  const jwks = await getRequest<JwksDocument>("http://localhost:3401/.well-known/jwks.json");
  const claims = await verifyIdToken(token.id_token, jwks.keys[0]);

  await setUserSession(event, {
    id: claims.sub,
    name: claims.name,
    accessToken: token.access_token,
  });

  return { message: "交換できました！" };
};

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as Record<string, unknown>;

  const input: ExchangeInput = {
    code: pickString(body, "code"),
    state: pickString(body, "state"),
  };

  return exchangeLogic(event, input);
});
