# 2-4. code を token に交換する

RP の callback で code を token に交換します。

## 実装するファイル

| ファイル                                                          | 関数            |
| ----------------------------------------------------------------- | --------------- |
| `templates/packages/relying-party/server/routes/exchange.post.ts` | `exchangeLogic` |
| `templates/packages/relying-party/app/pages/callback.vue`         | `exchangeCode`  |

## `exchange.post.ts` の `exchangeLogic` を実装する

code を受け取って、token endpoint にリクエストして、access token を取得し、セッションに保存します。

### 実装手順

1. `input.code` が空文字列なら、エラーを`throw new Error()`する
2. `postRequest` で token endpoint (`http://localhost:3001/token`) に POST する
   - `grant_type: "authorization_code"`、`code: input.code`、`client_id: "rp-demo"` を送る
   - フォーム形式で送る
3. `setUserSession` で access token をセッションに保存する
4. `{ message: "交換できました！" }` を返す

### 使うユーティリティ関数

| 関数                                      | 役割                                  |
| ----------------------------------------- | ------------------------------------- |
| `postRequest<Response>(url, body, form?)` | POST リクエストを送る                 |
| `setUserSession(event, payload)`          | セッションを保存する (cookie + Redis) |

### ヒント

:::details ヒント1
手順1のエラーは、`throw new Error("missing code")` で投げましょう。
:::

:::details ヒント2
手順2の `postRequest` は、以下の引数で呼び出します。

```ts
postRequest<TokenResponse>(
  "http://localhost:3001/token",
  {
    grant_type: "authorization_code",
    code: input.code,
    client_id: "rp-demo",
  },
  true, // フォーム形式で送信
);
```

`form` 引数に `true` を渡すと、フォーム形式 (`application/x-www-form-urlencoded`) で送信されます。
:::

:::details ヒント3
手順3の `setUserSession` は、`event` とセッションの内容を渡します。  
access token は `token.access_token` で取得できます。

```ts
await setUserSession(event, {
  accessToken: token.access_token,
});
```

:::

### 想定解答

:::details 想定解答

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
const exchangeLogic = async (event: H3Event, input: ExchangeInput): Promise<ExchangeResponse> => {
  return { message: "" }; // [!code --]

  if (input.code === "") { // [!code ++]
    throw new Error("missing code"); // [!code ++]
  } // [!code ++]

  const token = await postRequest<TokenResponse>( // [!code ++]
      "http://localhost:3001/token", // [!code ++]
      { // [!code ++]
        grant_type: "authorization_code", // [!code ++]
        code: input.code, // [!code ++]
        client_id: "rp-demo", // [!code ++]
      }, // [!code ++]
      true, // [!code ++]
    ); // [!code ++]

  await setUserSession(event, { // [!code ++]
    accessToken: token.access_token, // [!code ++]
  }); // [!code ++]

  return { message: "交換できました！" }; // [!code ++]
}; // [!code ++]
```

:::

## `callback.vue` の `exchangeCode` を実装する

クエリパラメータの code を `/exchange` に POST して、交換結果を受け取ります。

### 実装手順

1. `postRequest` で `/exchange` に POST する
   - `{ code }` を送る

### 使うユーティリティ関数

| 関数                                      | 役割                  |
| ----------------------------------------- | --------------------- |
| `postRequest<Response>(url, body, form?)` | POST リクエストを送る |

### ヒント

:::details ヒント1
手順1の `postRequest` は、以下の引数で呼び出します。  
`exchangeCode` は引数で `code` を受け取っているので、そのまま渡しましょう。

```ts
postRequest<ExchangeResponse>("/exchange", { code });
```

:::

### 想定解答

:::details 想定解答

```ts
// TODO: Phase 1: OAuth
const exchangeCode = async (code: string): Promise<ExchangeResponse> => {
  return { message: "" }; // [!code --]
  return postRequest<ExchangeResponse>("/exchange", { code }); // [!code ++]
}; // [!code ++]
```

:::
