# 5-1. ID Token を実装する

ID Token の発行・検証を実装します。

## RP: scope に openid を追加する

`templates/packages/relying-party/server/routes/authorization-url.get.ts` の `authorizationUrlLogic` を実装します。

scope に `openid` を追加します。

```ts
authorizeUrl.searchParams.set("scope", "openid example");
```

::: details 参考実装

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
// TODO: Phase 4: OIDC
const authorizationUrlLogic = async (event: H3Event): Promise<AuthorizationUrlResponse> => {
  const state = randomString(16);
  const codeVerifier = randomString(64);
  const codeChallenge = createBase64EncodedHash(codeVerifier);

  await setAuthRequest(event, { state, codeVerifier });

  const authorizeUrl = new URL("http://localhost:3101/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", "rp-demo");
  authorizeUrl.searchParams.set("scope", "openid example");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("code_challenge", codeChallenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");

  return { authorizeUrl: authorizeUrl.toString() };
};
```

:::

## OP: openid scope を許可する

`templates/packages/openid-provider/server/routes/consent.post.ts` の `consentLogic` を実装します。

許可する scope に `openid` を追加します。

```ts
if (scopes.some((scope) => !["openid", "example"].includes(scope))) {
  throw new Error("invalid_scope");
}
```

::: details 参考実装

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
const consentLogic = async (input: ConsentInput): Promise<ConsentResponse> => {
  // ... 省略 ...
  const scopes = input.scope.split(" ").filter((scope) => scope !== "");
  if (scopes.some((scope) => !["openid", "example"].includes(scope))) {
    throw new Error("invalid_scope");
  }
  // ... 省略 ...
};
```

:::

## OP: ID Token を発行する

`templates/packages/openid-provider/server/routes/token.post.ts` の `tokenLogic` を実装します。

scope に openid が含まれる場合のみ、ID Token を発行してレスポンスに含めます。

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 3: PKCE
// TODO: Phase 4: OIDC
const tokenLogic = async (input: TokenInput): Promise<TokenResponse> => {
  // ... 省略 ...
  const user = await findUser(stored.id);
  const accessToken = await createAccessToken({ sub: user.id, scope: stored.scope.join(" ") });

  if (!stored.scope.includes("openid")) {
    return {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: ACCESS_TOKEN_TTL_SEC,
    };
  }

  const idToken = await createIdToken({ sub: user.id, name: user.name });
  return {
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_TTL_SEC,
    id_token: idToken,
  };
};
```

::: details 参考実装

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 3: PKCE
// TODO: Phase 4: OIDC
const tokenLogic = async (input: TokenInput): Promise<TokenResponse> => {
  if (input.grantType !== "authorization_code") {
    throw new Error("unsupported_grant_type");
  }

  if (input.clientId !== "rp-demo") {
    throw new Error("invalid_client");
  }

  if (input.code === "" || input.codeVerifier === "") {
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

  const expected = createBase64EncodedHash(input.codeVerifier);
  if (expected !== stored.codeChallenge) {
    throw new Error("invalid_grant");
  }

  await deleteAuthCode(input.code);

  const user = await findUser(stored.id);
  const accessToken = await createAccessToken({ sub: user.id, scope: stored.scope.join(" ") });

  if (!stored.scope.includes("openid")) {
    return {
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: ACCESS_TOKEN_TTL_SEC,
    };
  }

  const idToken = await createIdToken({ sub: user.id, name: user.name });
  return {
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_TTL_SEC,
    id_token: idToken,
  };
};
```

:::

## OP: JWKS endpoint を公開する

`templates/packages/openid-provider/server/routes/well-known/jwks.json.get.ts` を実装します。

ID Token の検証に使う公開鍵を JWKS 形式で公開します。

```ts
// TODO: Phase 4: OIDC
const jwksLogic = async (): Promise<JwksDocument> => {
  return getJWTPublicKey();
};
```

::: details 参考実装

```ts
// TODO: Phase 4: OIDC
const jwksLogic = async (): Promise<JwksDocument> => {
  return getJWTPublicKey();
};

export default defineEventHandler(() => {
  return jwksLogic();
});
```

:::

## RP: ID Token を検証してセッションに保存する

`templates/packages/relying-party/server/routes/exchange.post.ts` の `exchangeLogic` を実装します。

JWKS を取得して ID Token を検証し、ユーザー情報（sub / name）をセッションに保存します。

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
// TODO: Phase 4: OIDC
const exchangeLogic = async (event: H3Event, input: ExchangeInput): Promise<ExchangeResponse> => {
  // ... 省略 ...
  const token = await postRequest<TokenResponse>(
    "http://localhost:3101/token",
    {
      grant_type: "authorization_code",
      code: input.code,
      client_id: "rp-demo",
      code_verifier: authRequest.codeVerifier,
    },
    true,
  );
  if (token.id_token === undefined) {
    throw new Error("missing id_token");
  }

  const jwks = await getRequest<JwksDocument>("http://localhost:3101/.well-known/jwks.json");
  const claims = await verifyIdToken(token.id_token, jwks.keys[0]);

  await setUserSession(event, {
    id: claims.sub,
    name: claims.name,
    accessToken: token.access_token,
  });

  return { message: "交換できました！" };
};
```

::: details 参考実装

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
// TODO: Phase 4: OIDC
const exchangeLogic = async (event: H3Event, input: ExchangeInput): Promise<ExchangeResponse> => {
  if (input.code === "" || input.state === "") {
    throw new Error("missing code or state");
  }

  const authRequest = await getAuthRequest(event);
  if (authRequest.state !== input.state) {
    throw new Error("invalid state");
  }

  await deleteAuthRequest(event);

  const token = await postRequest<TokenResponse>(
    "http://localhost:3101/token",
    {
      grant_type: "authorization_code",
      code: input.code,
      client_id: "rp-demo",
      code_verifier: authRequest.codeVerifier,
    },
    true,
  );
  if (token.id_token === undefined) {
    throw new Error("missing id_token");
  }

  const jwks = await getRequest<JwksDocument>("http://localhost:3101/.well-known/jwks.json");
  const claims = await verifyIdToken(token.id_token, jwks.keys[0]);

  await setUserSession(event, {
    id: claims.sub,
    name: claims.name,
    accessToken: token.access_token,
  });

  return { message: "交換できました！" };
};
```

:::
