export const OP_ISSUER = "http://localhost:3101";
export const OP_PORT = 3101;
export const RP_ORIGIN = "http://localhost:3100";
export const RP_PORT = 3100;

export const CLIENT_ID = "rp-demo";
export const REDIRECT_URI = `${RP_ORIGIN}/auth/callback`;
export const SCOPES = "openid profile";

export const ALGORITHM = "ES256";
export const KEY_ID = "demo-es256-1";

export const CODE_TTL_SEC = 300;
export const ACCESS_TOKEN_TTL_SEC = 300;
export const ID_TOKEN_TTL_SEC = 300;

export const DEMO_USERS = [
  { sub: "user-1", name: "Alice", email: "alice@example.com" },
  { sub: "user-2", name: "Bob", email: "bob@example.com" },
] as const;

export type DemoUser = (typeof DEMO_USERS)[number];
