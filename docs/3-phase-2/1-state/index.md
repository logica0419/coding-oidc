# 3-1. state を実装する

state を使った CSRF 対策を実装します。

## RP: state を生成して authorization URL に付ける

`templates/packages/relying-party/server/routes/authorization-url.get.ts` の `authorizationUrlLogic` を実装します。

state を生成して、cookie に保存し、authorization URL に付けます。

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
const authorizationUrlLogic = async (event: H3Event): Promise<AuthorizationUrlResponse> => {
  const state = randomString(16);

  await setAuthRequest(event, { state });

  const authorizeUrl = new URL("http://localhost:3101/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", "rp-demo");
  authorizeUrl.searchParams.set("scope", "example");
  authorizeUrl.searchParams.set("state", state);

  return { authorizeUrl: authorizeUrl.toString() };
};
```

::: details 参考実装

```ts
import type { H3Event } from "h3";

// TODO: Phase 1: OAuth
// TODO: Phase 2: state
const authorizationUrlLogic = async (event: H3Event): Promise<AuthorizationUrlResponse> => {
  const state = randomString(16);

  await setAuthRequest(event, { state });

  const authorizeUrl = new URL("http://localhost:3101/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", "rp-demo");
  authorizeUrl.searchParams.set("scope", "example");
  authorizeUrl.searchParams.set("state", state);

  return { authorizeUrl: authorizeUrl.toString() };
};

export default defineEventHandler((event) => {
  return authorizationUrlLogic(event);
});
```

:::

## OP: state を code に紐づけて保存し、リダイレクトに付ける

`templates/packages/openid-provider/server/routes/consent.post.ts` の `consentLogic` を実装します。

state を auth code に保存し、リダイレクト URL にも state を付けます。

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
const consentLogic = async (input: ConsentInput): Promise<ConsentResponse> => {
  if (input.state === "") {
    throw new Error("invalid_request");
  }

  const user = await findUser(input.userId);
  const code = randomString(32);

  await setAuthCode(code, {
    clientId: input.clientId,
    scope: scopes,
    state: input.state,
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
    id: user.id,
  });

  const redirect = new URL("http://localhost:3100/callback");
  redirect.searchParams.set("code", code);
  redirect.searchParams.set("state", input.state);

  return { redirectTo: redirect.toString() };
};
```

:::

## OP: 認可ページから state を送信する

`templates/packages/openid-provider/app/pages/authorize.vue` の `grantAccess` と `input` を実装します。

クエリの `state` を consent リクエストに含めます。

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
const grantAccess = async (userId: string, input: ConsentInput): Promise<void> => {
  const result = await postRequest<ConsentResponse>("/consent", {
    response_type: input.responseType,
    client_id: input.clientId,
    scope: input.scope,
    state: input.state,
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
};
```

::: details 参考実装

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
const grantAccess = async (userId: string, input: ConsentInput): Promise<void> => {
  const result = await postRequest<ConsentResponse>("/consent", {
    response_type: input.responseType,
    client_id: input.clientId,
    scope: input.scope,
    state: input.state,
    user_id: userId,
  });

  redirectTo(result.redirectTo);
};
```

:::

## RP: callback で state を検証する

`templates/packages/relying-party/server/routes/exchange.post.ts` の `exchangeLogic` と、`templates/packages/relying-party/app/pages/callback.vue` の `exchangeCode` を実装します。

cookie に保存した state と、リダイレクトで返ってきた state を比較します。一致しなければエラーにします。

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
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
    },
    true,
  );

  await setUserSession(event, {
    accessToken: token.access_token,
  });

  return { message: "交換できました！" };
};
```

```ts
// TODO: Phase 1: OAuth
const exchangeCode = async (code: string, state: string): Promise<ExchangeResponse> => {
  return postRequest<ExchangeResponse>("/exchange", { code, state });
};
```

::: details 参考実装

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
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
