export interface TokenResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  id_token?: string;
}

export type UsersResponse = { id: string; name: string }[];

export interface ExampleResponse {
  message: string;
}

export interface ConsentResponse {
  redirectTo: string;
}

export interface AuthorizationUrlResponse {
  authorizeUrl: string;
}

export interface ExchangeResponse {
  message: string;
}

export interface MeResponse {
  sub: string;
  name: string;
}

export const getRequest = async <Response>(
  url: string,
  headers: Record<string, string> = {},
): Promise<Response> => {
  const res = await fetch(url, { headers });

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: unknown } | null;
    const message =
      typeof data?.error === "string" ? data.error : `GET ${url} failed: ${res.status}`;
    throw new Error(message);
  }

  return (await res.json()) as Response;
};

export const postRequest = async <Response>(
  url: string,
  body: Record<string, string>,
  form = false,
): Promise<Response> => {
  const res = await fetch(url, {
    method: "POST",
    headers: form
      ? { "content-type": "application/x-www-form-urlencoded" }
      : { "content-type": "application/json" },
    body: form ? new URLSearchParams(body).toString() : JSON.stringify(body),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: unknown } | null;
    const message =
      typeof data?.error === "string" ? data.error : `POST ${url} failed: ${res.status}`;
    throw new Error(message);
  }

  return (await res.json()) as Response;
};

export const pickString = (record: Record<string, unknown>, name: string): string => {
  const value = record[name];

  return typeof value === "string" ? value : "";
};

export const redirectTo = (url: string): void => {
  const location = globalThis.location as unknown as { href: string };
  location.href = url;
};
