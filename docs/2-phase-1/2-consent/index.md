# 2-2. code を発行する

OP の認可ページから code を発行します。

## consent を実装する

`templates/packages/openid-provider/server/routes/consent.post.ts` の `consentLogic` を実装します。

認可ページ（`GET /authorize`）が authorization endpoint の役割を果たし、`POST /consent` はそのサーバー側ヘルパーです。ユーザーが選択した `user_id` に対して code を発行し、RP の callback にリダイレクトします。

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
const consentLogic = async (input: ConsentInput): Promise<ConsentResponse> => {
  const user = await findUser(input.userId);
  const code = randomString(32);

  await setAuthCode(code, {
    clientId: input.clientId,
    scope: scopes,
    id: user.id,
  });

  const redirect = new URL("http://localhost:3100/callback");
  redirect.searchParams.set("code", code);

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
    id: user.id,
  });

  const redirect = new URL("http://localhost:3100/callback");
  redirect.searchParams.set("code", code);

  return { redirectTo: redirect.toString() };
};
```

:::

## 認可ページから consent を送信する

`templates/packages/openid-provider/app/pages/authorize.vue` の `grantAccess` を実装します。

`/consent` に POST して、リダイレクト先を取得します。

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
const grantAccess = async (userId: string, input: ConsentInput): Promise<void> => {
  const result = await postRequest<ConsentResponse>("/consent", {
    response_type: input.responseType,
    client_id: input.clientId,
    scope: input.scope,
    user_id: userId,
  });

  redirectTo(result.redirectTo);
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
    user_id: userId,
  });

  redirectTo(result.redirectTo);
};
```

:::
