export interface AuthorizeQuery {
  response_type: string;
  client_id: string;
  redirect_uri: string;
  scope: string;
  state: string;
  code_challenge: string;
  code_challenge_method: string;
}

export interface TokenForm {
  grant_type: string;
  code: string;
  redirect_uri: string;
  client_id: string;
  code_verifier?: string;
}

export type TokenRequest = TokenForm;

export interface TokenResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  id_token: string;
}

export interface UserInfoResponse {
  sub: string;
  name: string;
}

export interface DiscoveryDocument {
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

export const getRequest = async <Response>(url: string): Promise<Response> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`GET ${url} failed: ${res.status}`);
  }
  return (await res.json()) as Response;
};

export const postRequest = async <Response>(url: string, body: unknown): Promise<Response> => {
  const isForm = body instanceof URLSearchParams;
  const res = await fetch(url, {
    method: "POST",
    headers: isForm
      ? { "content-type": "application/x-www-form-urlencoded" }
      : { "content-type": "application/json" },
    body: isForm ? body.toString() : JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`POST ${url} failed: ${res.status}`);
  }
  return (await res.json()) as Response;
};

export const postForm = async <Response>(
  url: string,
  form: Record<string, string>,
): Promise<Response> => {
  const params = new URLSearchParams(form);
  return postRequest<Response>(url, params);
};

export const redirectTo = (url: string): void => {
  const location = globalThis.location as unknown as { href: string };
  location.href = url;
};
