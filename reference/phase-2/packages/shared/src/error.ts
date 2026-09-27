import { setResponseStatus } from "h3";
import type { H3Event } from "h3";

export const handleError = (event: H3Event, error: unknown): { error: string } => {
  const message = error instanceof Error ? error.message : "invalid_request";
  setResponseStatus(event, 400);
  return { error: message };
};
