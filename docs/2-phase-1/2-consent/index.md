# 2-2. code を発行する

OP の認可ページから code を発行します。

## 実装するファイル

| ファイル                                                           | 関数           |
| ------------------------------------------------------------------ | -------------- |
| `templates/packages/openid-provider/server/routes/consent.post.ts` | `consentLogic` |
| `templates/packages/openid-provider/app/pages/authorize.vue`       | `grantAccess`  |

## `consent.post.ts` の `consentLogic` を実装する

認可ページ（`GET /authorize`）が authorization endpoint の役割を果たし、`POST /consent` はそのサーバー側ヘルパーです。ユーザーが選択した `user_id` に対して code を発行し、RP の callback にリダイレクトします。

### 実装手順

1. `input.responseType` が `"code"` でなければ、`unsupported_response_type` を投げる
2. `input.clientId` が `"rp-demo"` でなければ、`invalid_client` を投げる
3. `input.scope` をスペース区切りで分割し、`example` 以外が含まれていれば `invalid_scope` を投げる
4. `input.userId` が空文字列なら、`invalid_request` を投げる
5. `findUser` でユーザーを取得し、`randomString(32)` で code を作る
6. `setAuthCode` で code と `clientId` / `scope` / `id` を保存する
7. `http://localhost:3000/callback` に `code` を付けて、`redirectTo` として返す

### 使うユーティリティ関数

| 関数                         | 役割                         |
| ---------------------------- | ---------------------------- |
| `findUser(userId)`           | ユーザーを取得する           |
| `randomString(length)`       | ランダムな文字列を生成する   |
| `setAuthCode(code, payload)` | 認可コードを保存する (Redis) |

### ヒント

:::details ヒント1
手順3の scope 分割は、以下のように書きます。

```ts
const scopes = input.scope.split(" ").filter((scope) => scope !== "");
if (scopes.some((scope) => !["example"].includes(scope))) {
  throw new Error("invalid_scope");
}
```

:::

:::details ヒント2
手順6の `setAuthCode` は、以下の引数で呼び出します。

```ts
await setAuthCode(code, {
  clientId: input.clientId,
  scope: scopes,
  id: user.id,
});
```

:::

:::details ヒント3
手順7のリダイレクト URL 構築は、以下のように書きます。

```ts
const redirect = new URL("http://localhost:3000/callback");
redirect.searchParams.set("code", code);

return { redirectTo: redirect.toString() };
```

:::

### 想定解答

:::details 想定解答

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
const consentLogic = async (input: ConsentInput): Promise<ConsentResponse> => {
  return { redirectTo: "" }; // [!code --]
  if (input.responseType !== "code") { // [!code ++]
    throw new Error("unsupported_response_type"); // [!code ++]
  } // [!code ++]

  if (input.clientId !== "rp-demo") { // [!code ++]
    throw new Error("invalid_client"); // [!code ++]
  } // [!code ++]

  const scopes = input.scope.split(" ").filter((scope) => scope !== ""); // [!code ++]
  if (scopes.some((scope) => !["example"].includes(scope))) { // [!code ++]
    throw new Error("invalid_scope"); // [!code ++]
  } // [!code ++]

  if (input.userId === "") { // [!code ++]
    throw new Error("invalid_request"); // [!code ++]
  } // [!code ++]

  const user = await findUser(input.userId); // [!code ++]
  const code = randomString(32); // [!code ++]

  await setAuthCode(code, { // [!code ++]
    clientId: input.clientId, // [!code ++]
    scope: scopes, // [!code ++]
    id: user.id, // [!code ++]
  }); // [!code ++]

  const redirect = new URL("http://localhost:3000/callback"); // [!code ++]
  redirect.searchParams.set("code", code); // [!code ++]

  return { redirectTo: redirect.toString() }; // [!code ++]
}; // [!code ++]
```

:::

## `authorize.vue` の `grantAccess` を実装する

`/consent` に POST して、リダイレクト先を取得します。

### 実装手順

1. `postRequest` で `/consent` に POST する
   - `response_type`、`client_id`、`scope`、`user_id` を送る
2. `redirectTo` で `result.redirectTo` にリダイレクトする

### 使うユーティリティ関数

| 関数                                      | 役割                            |
| ----------------------------------------- | ------------------------------- |
| `postRequest<Response>(url, body, form?)` | POST リクエストを送る           |
| `redirectTo(url)`                         | 指定した URL にリダイレクトする |

### ヒント

:::details ヒント1
手順1の `postRequest` は、以下の引数で呼び出します。

```ts
postRequest<ConsentResponse>("/consent", {
  response_type: input.responseType,
  client_id: input.clientId,
  scope: input.scope,
  user_id: userId,
});
```

:::

### 想定解答

:::details 想定解答

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
const grantAccess = async (userId: string, input: ConsentInput): Promise<void> => {
  return; // [!code --]
  const result = await postRequest<ConsentResponse>("/consent", { // [!code ++]
    response_type: input.responseType, // [!code ++]
    client_id: input.clientId, // [!code ++]
    scope: input.scope, // [!code ++]
    user_id: userId, // [!code ++]
  }); // [!code ++]

  redirectTo(result.redirectTo); // [!code ++]
}; // [!code ++]
```

:::
