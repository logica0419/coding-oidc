export default defineEventHandler(async (event) => {
  const path = event.path;
  if (!path.startsWith("/api/")) {
    return;
  }

  const referer = getHeader(event, "referer");
  const origin = getHeader(event, "origin");
  if (
    (referer !== undefined && referer.startsWith("http://localhost:3201")) ||
    (origin !== undefined && origin.startsWith("http://localhost:3201"))
  ) {
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
