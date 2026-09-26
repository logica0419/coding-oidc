import Redis from "ioredis";

import { CODE_TTL_SEC, ACCESS_TOKEN_TTL_SEC } from "./constants";

let client: Redis | undefined;

export const getRedis = (): Redis => {
  if (client === undefined) {
    client = new Redis(process.env.VALKEY_URL ?? "redis://localhost:6379", {
      maxRetriesPerRequest: 3,
    });
  }
  return client;
};

export interface AuthCodePayload {
  clientId: string;
  redirectUri: string;
  scope: string;
  state: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  sub: string;
}

export interface SessionPayload {
  sub: string;
  name: string;
}

export interface LoginStatePayload {
  codeVerifier: string;
  nonce: string;
}

export interface StoredUser {
  id: string;
  name: string;
}

const key = (service: string, category: string, id: string): string => {
  return `${service}-${category}-${id}`;
};

const getOne = async <Value>(fullKey: string): Promise<Value | null> => {
  const raw = await getRedis().get(fullKey);
  if (raw === null) {
    return null;
  }
  return JSON.parse(raw) as Value;
};

const getOneOrThrow = async <Value>(fullKey: string, message: string): Promise<Value> => {
  const value = await getOne<Value>(fullKey);
  if (value === null) {
    throw new Error(message);
  }
  return value;
};

const collectValues = async <Value>(foundKeys: string[]): Promise<Value[]> => {
  const values = await Promise.all(foundKeys.map((itemKey) => getOne<Value>(itemKey)));
  const out: Value[] = [];
  for (const value of values) {
    if (value !== null) {
      out.push(value);
    }
  }
  return out;
};

const getAll = async <Value>(pattern: string): Promise<Value[]> => {
  const redis = getRedis();
  const out: Value[] = [];
  let cursor = "0";
  do {
    const [next, foundKeys] = await redis.scan(cursor, "MATCH", pattern, "COUNT", 100);
    cursor = next;
    out.push(...(await collectValues<Value>(foundKeys)));
  } while (cursor !== "0");
  return out;
};

export const getAuthCode = (code: string): Promise<AuthCodePayload> => {
  return getOneOrThrow<AuthCodePayload>(key("op", "code", code), "auth code not found");
};

export const getAllAuthCodes = (): Promise<AuthCodePayload[]> => {
  return getAll<AuthCodePayload>("op-code-*");
};

export const setAuthCode = async (code: string, payload: AuthCodePayload): Promise<void> => {
  await getRedis().set(key("op", "code", code), JSON.stringify(payload), "EX", CODE_TTL_SEC);
};

export const deleteAuthCode = async (code: string): Promise<void> => {
  await getRedis().del(key("op", "code", code));
};

export const getStoredSession = (sessionId: string): Promise<SessionPayload> => {
  return getOneOrThrow<SessionPayload>(key("op", "session", sessionId), "session not found");
};

export const getAllStoredSessions = (): Promise<SessionPayload[]> => {
  return getAll<SessionPayload>("op-session-*");
};

export const setStoredSession = async (
  sessionId: string,
  payload: SessionPayload,
): Promise<void> => {
  await getRedis().set(
    key("op", "session", sessionId),
    JSON.stringify(payload),
    "EX",
    ACCESS_TOKEN_TTL_SEC,
  );
};

export const deleteStoredSession = async (sessionId: string): Promise<void> => {
  await getRedis().del(key("op", "session", sessionId));
};

export const getLoginState = (state: string): Promise<LoginStatePayload> => {
  return getOneOrThrow<LoginStatePayload>(key("rp", "login", state), "login state not found");
};

export const getAllLoginStates = (): Promise<LoginStatePayload[]> => {
  return getAll<LoginStatePayload>("rp-login-*");
};

export const setLoginState = async (state: string, payload: LoginStatePayload): Promise<void> => {
  await getRedis().set(key("rp", "login", state), JSON.stringify(payload), "EX", CODE_TTL_SEC);
};

export const deleteLoginState = async (state: string): Promise<void> => {
  await getRedis().del(key("rp", "login", state));
};

export const getStoredUser = (id: string): Promise<StoredUser> => {
  return getOneOrThrow<StoredUser>(key("op", "user", id), "user not found");
};

export const getAllStoredUsers = (): Promise<StoredUser[]> => {
  return getAll<StoredUser>("op-user-*");
};

export const setStoredUser = async (id: string, payload: StoredUser): Promise<void> => {
  await getRedis().set(key("op", "user", id), JSON.stringify(payload));
};
