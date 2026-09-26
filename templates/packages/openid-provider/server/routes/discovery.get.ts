interface DiscoveryOutput {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
  response_types_supported: string[];
  subject_types_supported: string[];
  id_token_signing_alg_values_supported: string[];
  scopes_supported: string[];
  code_challenge_methods_supported: string[];
}

// TODO: Phase 6: OIDC Discovery Endpoint
const discoveryLogic = async (): Promise<DiscoveryOutput> => {
  return {
    issuer: OP_ISSUER,
    authorization_endpoint: `${OP_ISSUER}/authorize`,
    token_endpoint: `${OP_ISSUER}/token`,
    userinfo_endpoint: `${OP_ISSUER}/userinfo`,
    jwks_uri: `${OP_ISSUER}/jwks`,
    response_types_supported: ["code"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: [ALGORITHM],
    scopes_supported: ["openid", "example"],
    code_challenge_methods_supported: ["S256"],
  };
};

export default defineEventHandler(async () => {
  try {
    return await discoveryLogic();
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : "discovery failed",
    });
  }
});
