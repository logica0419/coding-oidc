export const OP_ISSUER = "http://localhost:3101";
export const OP_PORT = 3101;
export const RP_ORIGIN = "http://localhost:3100";
export const RP_PORT = 3100;

export const CLIENT_ID = "rp-demo";
export const REDIRECT_URI = `${RP_ORIGIN}/auth/callback`;
export const SCOPES = "openid example";

export const ALGORITHM = "ES256";
export const KEY_ID = "demo-es256-1";

export const CODE_TTL_SEC = 300;
export const ACCESS_TOKEN_TTL_SEC = 300;
export const ID_TOKEN_TTL_SEC = 300;

export const DEMO_USERS = [
  { id: "user1", name: "ユーザー1" },
  { id: "user2", name: "ユーザー2" },
] as const;

export type DemoUser = (typeof DEMO_USERS)[number];

export interface DemoUserRecord {
  id: string;
  name: string;
}
