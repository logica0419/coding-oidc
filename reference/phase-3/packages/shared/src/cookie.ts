import { getCookie, setCookie } from "h3";
import type { H3Event } from "h3";

import { ACCESS_TOKEN_TTL_SEC, CODE_TTL_SEC } from "./constants";
import { randomString } from "./crypto";
import {
  deleteStoredAuthRequest,
  getStoredAuthRequest,
  getStoredSession,
  setStoredAuthRequest,
  setStoredSession,
} from "./store";
import type { AuthRequestPayload, SessionPayload } from "./store";

const setCookieId = (event: H3Event, name: string, id: string, maxAge: number): void => {
  setCookie(event, name, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge,
  });
};

const getCookieId = (event: H3Event, name: string): string => {
  return getCookie(event, name) ?? "";
};

const deleteCookieId = (event: H3Event, name: string): void => {
  setCookie(event, name, "", { maxAge: 0, path: "/" });
};

export const setUserSession = async (event: H3Event, payload: SessionPayload): Promise<void> => {
  const sessionId = randomString(32);
  await setStoredSession(sessionId, payload);
  setCookieId(event, "session_id", sessionId, ACCESS_TOKEN_TTL_SEC);
};

export const getUserSession = async (event: H3Event): Promise<SessionPayload> => {
  const sessionId = getCookieId(event, "session_id");
  if (sessionId === "") {
    throw new Error("missing session");
  }

  return getStoredSession(sessionId);
};

export const setAuthRequest = async (
  event: H3Event,
  payload: AuthRequestPayload,
): Promise<void> => {
  const authRequestId = randomString(32);
  await setStoredAuthRequest(authRequestId, payload);
  setCookieId(event, "auth_request_id", authRequestId, CODE_TTL_SEC);
};

export const getAuthRequest = async (event: H3Event): Promise<AuthRequestPayload> => {
  const authRequestId = getCookieId(event, "auth_request_id");
  if (authRequestId === "") {
    throw new Error("missing auth request");
  }

  return getStoredAuthRequest(authRequestId);
};

export const deleteAuthRequest = async (event: H3Event): Promise<void> => {
  const authRequestId = getCookieId(event, "auth_request_id");
  if (authRequestId !== "") {
    await deleteStoredAuthRequest(authRequestId);
  }

  deleteCookieId(event, "auth_request_id");
};
