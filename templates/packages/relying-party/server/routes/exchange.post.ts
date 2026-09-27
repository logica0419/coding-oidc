import type { H3Event } from "h3";

interface ExchangeInput {
  code: string;
}

// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
// TODO: Phase 4: OIDC
const exchangeLogic = async (event: H3Event, input: ExchangeInput): Promise<ExchangeResponse> => {
  return { message: "" };
};

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as Record<string, unknown>;

  const input: ExchangeInput = {
    code: pickString(body, "code"),
  };

  return exchangeLogic(event, input);
});
