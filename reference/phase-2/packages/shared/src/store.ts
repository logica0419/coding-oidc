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
  scope: string[];
  state: string;
  id: string;
}

export interface SessionPayload {
  id?: string;
  name?: string;
  accessToken: string;
}

export interface AuthRequestPayload {
  state: string;
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

export const setAuthCode = async (code: string, payload: AuthCodePayload): Promise<void> => {
  await getRedis().set(key("op", "code", code), JSON.stringify(payload), "EX", CODE_TTL_SEC);
};

export const deleteAuthCode = async (code: string): Promise<void> => {
  await getRedis().del(key("op", "code", code));
};

export const getStoredSession = (sessionId: string): Promise<SessionPayload> => {
  return getOneOrThrow<SessionPayload>(key("op", "session", sessionId), "session not found");
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

export const getStoredAuthRequest = (authRequestId: string): Promise<AuthRequestPayload> => {
  return getOneOrThrow<AuthRequestPayload>(
    key("rp", "auth-request", authRequestId),
    "auth request not found",
  );
};

export const setStoredAuthRequest = async (
  authRequestId: string,
  payload: AuthRequestPayload,
): Promise<void> => {
  await getRedis().set(
    key("rp", "auth-request", authRequestId),
    JSON.stringify(payload),
    "EX",
    CODE_TTL_SEC,
  );
};

export const deleteStoredAuthRequest = async (authRequestId: string): Promise<void> => {
  await getRedis().del(key("rp", "auth-request", authRequestId));
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
