export default defineEventHandler(async (event) => {
  const path = event.path;
  if (!path.startsWith("/api/example")) {
    return;
  }
  const authorization = getHeader(event, "authorization");
  if (authorization === undefined || !authorization.startsWith("Bearer ")) {
    throw createError({ statusCode: 401, statusMessage: "missing bearer token" });
  }
  const token = authorization.slice("Bearer ".length);
  try {
    const claims = await verifyAccessToken(token);
    event.context.accessToken = claims;
  } catch {
    throw createError({ statusCode: 401, statusMessage: "invalid access token" });
  }
});
