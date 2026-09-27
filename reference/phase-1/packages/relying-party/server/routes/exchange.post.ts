import type { H3Event } from "h3";

interface ExchangeInput {
  code: string;
}

// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
// TODO: Phase 4: OIDC
const exchangeLogic = async (event: H3Event, input: ExchangeInput): Promise<ExchangeResponse> => {
  if (input.code === "") {
    throw new Error("missing code");
  }

  const token = await postRequest<TokenResponse>(
    "http://localhost:3101/token",
    {
      grant_type: "authorization_code",
      code: input.code,
      client_id: "rp-demo",
    },
    true,
  );

  await setUserSession(event, {
    accessToken: token.access_token,
  });

  return { message: "交換できました！" };
};

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as Record<string, unknown>;

  const input: ExchangeInput = {
    code: pickString(body, "code"),
  };

  return exchangeLogic(event, input);
});
