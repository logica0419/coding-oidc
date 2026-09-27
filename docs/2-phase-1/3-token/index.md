# 2-3. token endpoint を実装する

OP の token endpoint を実装します。

`templates/packages/openid-provider/server/routes/token.post.ts` の `tokenLogic` を実装します。

code を受け取って、access token を発行します。

```ts
// TODO: Phase 1: OAuth
const tokenLogic = async (input: TokenInput): Promise<TokenResponse> => {
  const stored = await getAuthCode(input.code);
  await deleteAuthCode(input.code);

  const user = await findUser(stored.id);
  const accessToken = await createAccessToken({ sub: user.id, scope: stored.scope.join(" ") });

  return {
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_TTL_SEC,
  };
};
```

::: details 参考実装

```ts
// TODO: Phase 1: OAuth
const tokenLogic = async (input: TokenInput): Promise<TokenResponse> => {
  if (input.grantType !== "authorization_code") {
    throw new Error("unsupported_grant_type");
  }

  if (input.clientId !== "rp-demo") {
    throw new Error("invalid_client");
  }

  if (input.code === "") {
    throw new Error("invalid_request");
  }

  let stored: AuthCodePayload;
  try {
    stored = await getAuthCode(input.code);
  } catch {
    throw new Error("invalid_grant");
  }

  if (stored.clientId !== input.clientId) {
    throw new Error("invalid_grant");
  }

  await deleteAuthCode(input.code);

  const user = await findUser(stored.id);
  const accessToken = await createAccessToken({ sub: user.id, scope: stored.scope.join(" ") });

  return {
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_TTL_SEC,
  };
};
```

:::
