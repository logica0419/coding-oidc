# 4-1. PKCE を実装する

PKCE を使ったコード乗っ取り攻撃対策を実装します。

## RP: code_verifier を生成して code_challenge を計算する

`templates/packages/relying-party/server/routes/authorization-url.get.ts` の `authorizationUrlLogic` を実装します。

code_verifier を生成し、SHA-256 ハッシュを base64url エンコードした code_challenge を計算して、authorization URL に付けます。

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
const authorizationUrlLogic = async (event: H3Event): Promise<AuthorizationUrlResponse> => {
  const state = randomString(16);
  const codeVerifier = randomString(64);
  const codeChallenge = createBase64EncodedHash(codeVerifier);

  await setAuthRequest(event, { state, codeVerifier });

  const authorizeUrl = new URL("http://localhost:3101/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", "rp-demo");
  authorizeUrl.searchParams.set("scope", "example");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("code_challenge", codeChallenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");

  return { authorizeUrl: authorizeUrl.toString() };
};
```

::: details 参考実装

```ts
import type { H3Event } from "h3";

// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
const authorizationUrlLogic = async (event: H3Event): Promise<AuthorizationUrlResponse> => {
  const state = randomString(16);
  const codeVerifier = randomString(64);
  const codeChallenge = createBase64EncodedHash(codeVerifier);

  await setAuthRequest(event, { state, codeVerifier });

  const authorizeUrl = new URL("http://localhost:3101/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", "rp-demo");
  authorizeUrl.searchParams.set("scope", "example");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("code_challenge", codeChallenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");

  return { authorizeUrl: authorizeUrl.toString() };
};

export default defineEventHandler((event) => {
  return authorizationUrlLogic(event);
});
```

:::

## OP: code_challenge を検証して保存する

`templates/packages/openid-provider/server/routes/consent.post.ts` の `consentLogic` を実装します。

code_challenge が必須で、code_challenge_method が S256 であることを検証し、auth code に保存します。

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
const consentLogic = async (input: ConsentInput): Promise<ConsentResponse> => {
  if (input.codeChallenge === "" || input.codeChallengeMethod !== "S256") {
    throw new Error("invalid_request");
  }

  const user = await findUser(input.userId);
  const code = randomString(32);

  await setAuthCode(code, {
    clientId: input.clientId,
    scope: scopes,
    state: input.state,
    codeChallenge: input.codeChallenge,
    codeChallengeMethod: input.codeChallengeMethod,
    id: user.id,
  });

  const redirect = new URL("http://localhost:3100/callback");
  redirect.searchParams.set("code", code);
  redirect.searchParams.set("state", input.state);

  return { redirectTo: redirect.toString() };
};
```

::: details 参考実装

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
const consentLogic = async (input: ConsentInput): Promise<ConsentResponse> => {
  if (input.responseType !== "code") {
    throw new Error("unsupported_response_type");
  }

  if (input.clientId !== "rp-demo") {
    throw new Error("invalid_client");
  }

  if (input.state === "") {
    throw new Error("invalid_request");
  }

  if (input.codeChallenge === "" || input.codeChallengeMethod !== "S256") {
    throw new Error("invalid_request");
  }

  const scopes = input.scope.split(" ").filter((scope) => scope !== "");
  if (scopes.some((scope) => !["example"].includes(scope))) {
    throw new Error("invalid_scope");
  }

  if (input.userId === "") {
    throw new Error("invalid_request");
  }

  const user = await findUser(input.userId);
  const code = randomString(32);

  await setAuthCode(code, {
    clientId: input.clientId,
    scope: scopes,
    state: input.state,
    codeChallenge: input.codeChallenge,
    codeChallengeMethod: input.codeChallengeMethod,
    id: user.id,
  });

  const redirect = new URL("http://localhost:3100/callback");
  redirect.searchParams.set("code", code);
  redirect.searchParams.set("state", input.state);

  return { redirectTo: redirect.toString() };
};
```

:::

## OP: 認可ページから code_challenge を送信する

`templates/packages/openid-provider/app/pages/authorize.vue` の `grantAccess` と `input` を実装します。

クエリの `code_challenge` と `code_challenge_method` を consent リクエストに含めます。

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
const grantAccess = async (userId: string, input: ConsentInput): Promise<void> => {
  const result = await postRequest<ConsentResponse>("/consent", {
    response_type: input.responseType,
    client_id: input.clientId,
    scope: input.scope,
    state: input.state,
    code_challenge: input.codeChallenge,
    code_challenge_method: input.codeChallengeMethod,
    user_id: userId,
  });

  redirectTo(result.redirectTo);
};
```

```ts
const input: ConsentInput = {
  responseType: pickString(route.query, "response_type"),
  clientId: pickString(route.query, "client_id"),
  scope: pickString(route.query, "scope"),
  state: pickString(route.query, "state"),
  codeChallenge: pickString(route.query, "code_challenge"),
  codeChallengeMethod: pickString(route.query, "code_challenge_method"),
};
```

::: details 参考実装

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
const grantAccess = async (userId: string, input: ConsentInput): Promise<void> => {
  const result = await postRequest<ConsentResponse>("/consent", {
    response_type: input.responseType,
    client_id: input.clientId,
    scope: input.scope,
    state: input.state,
    code_challenge: input.codeChallenge,
    code_challenge_method: input.codeChallengeMethod,
    user_id: userId,
  });

  redirectTo(result.redirectTo);
};
```

:::

## OP: token endpoint で code_verifier を検証する

`templates/packages/openid-provider/server/routes/token.post.ts` の `tokenLogic` を実装します。

code_verifier の SHA-256 ハッシュが、保存された code_challenge と一致することを検証します。

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 3: PKCE
const tokenLogic = async (input: TokenInput): Promise<TokenResponse> => {
  const stored = await getAuthCode(input.code);

  const expected = createBase64EncodedHash(input.codeVerifier);
  if (expected !== stored.codeChallenge) {
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

::: details 参考実装

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 3: PKCE
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

  return {
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_TTL_SEC,
  };
};
```

:::

## RP: token リクエストに code_verifier を付ける

`templates/packages/relying-party/server/routes/exchange.post.ts` の `exchangeLogic` を実装します。

token リクエストに code_verifier を含めます。

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
const exchangeLogic = async (event: H3Event, input: ExchangeInput): Promise<ExchangeResponse> => {
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

  await setUserSession(event, {
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

  await setUserSession(event, {
    accessToken: token.access_token,
  });

  return { message: "交換できました！" };
};
```

:::
