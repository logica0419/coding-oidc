# 2-4. code を token に交換する

RP の callback で code を token に交換します。

`templates/packages/relying-party/server/routes/exchange.post.ts` の `exchangeLogic` と、`templates/packages/relying-party/app/pages/callback.vue` の `exchangeCode` を実装します。

code を受け取って、token endpoint にリクエストして、access token を取得し、セッションに保存します。

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
const exchangeLogic = async (event: H3Event, input: ExchangeInput): Promise<ExchangeResponse> => {
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
const exchangeCode = async (code: string): Promise<ExchangeResponse> => {
  return postRequest<ExchangeResponse>("/exchange", { code });
};
```

::: details 参考実装

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
const exchangeLogic = async (event: H3Event, input: ExchangeInput): Promise<ExchangeResponse> => {
  if (input.code === "") {
    throw new Error("missing code");
  }

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
