interface ConsentInput {
  responseType: string;
  clientId: string;
  scope: string;
  userId: string;
}

// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
const consentLogic = async (input: ConsentInput): Promise<ConsentResponse> => {
  return { redirectTo: "" };
};

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as Record<string, unknown>;

    const input: ConsentInput = {
      responseType: pickString(body, "response_type"),
      clientId: pickString(body, "client_id"),
      scope: pickString(body, "scope"),
      userId: pickString(body, "user_id"),
    };

    return await consentLogic(input);
  } catch (error) {
    return handleError(event, error);
  }
});
