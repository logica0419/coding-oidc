# 3-4. callback で state を検証する

RP の callback で state を検証します。

## 実装するファイル

| ファイル                                                          | 関数            |
| ----------------------------------------------------------------- | --------------- |
| `templates/packages/relying-party/server/routes/exchange.post.ts` | `exchangeLogic` |
| `templates/packages/relying-party/app/pages/callback.vue`         | `exchangeCode`  |

## `exchange.post.ts` の `exchangeLogic` を実装する

cookie に保存した state と、リダイレクトで返ってきた state を比較します。一致しなければエラーにします。

### 実装手順

Phase 1 の `exchangeLogic` を前提に、以下の差分を追加します。token 取得・セッション保存・返却は Phase 1 と同じです。

1. （変更）空文字検証を `input.code` のみに加えて `input.state` も対象にする
2. （追加）`getAuthRequest` で保存した state を取得し、`input.state` と一致しなければエラーを`throw new Error()`する
3. （追加）`deleteAuthRequest` で保存した state を削除する
4. Phase 1 と同じ `postRequest` で token endpoint に POST する（変更なし）
5. Phase 1 と同じく `setUserSession` で access token を保存する（変更なし）
6. Phase 1 と同じく `{ message: "交換できました！" }` を返す（変更なし）

### 使うユーティリティ関数

今回の差分で使う関数のみ記載します（`postRequest` / `setUserSession` は Phase 1 と同じ使い方のため省略）。

| 関数                       | 役割                     |
| -------------------------- | ------------------------ |
| `getAuthRequest(event)`    | 認可リクエストを取得する |
| `deleteAuthRequest(event)` | 認可リクエストを削除する |

### ヒント

:::details ヒント1
手順1のエラーは、`throw new Error("missing code or state")` で投げましょう。
:::

:::details ヒント2
手順2の state 検証は、以下のように書きます。

```ts
const authRequest = await getAuthRequest(event);
if (authRequest.state !== input.state) {
  throw new Error("invalid state");
}
```

:::

:::details ヒント3
手順4の `postRequest` は、以下の引数で呼び出します。

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

:::

### 想定解答

:::details 想定解答

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
const exchangeLogic = async (event: H3Event, input: ExchangeInput): Promise<ExchangeResponse> => {
  if (input.code === "" || input.state === "") { // [!code ++]
    throw new Error("missing code or state"); // [!code ++]
  } // [!code ++]

  const authRequest = await getAuthRequest(event); // [!code ++]
  if (authRequest.state !== input.state) { // [!code ++]
    throw new Error("invalid state"); // [!code ++]
  } // [!code ++]

  await deleteAuthRequest(event); // [!code ++]

  const token = await postRequest<TokenResponse>(
    "http://localhost:3001/token",
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

## `callback.vue` の `exchangeCode` を実装する

クエリパラメータの code と state を `/exchange` に POST して、交換結果を受け取ります。

### 実装手順

1. `postRequest` で `/exchange` に POST する
   - `{ code, state }` を送る

### 使うユーティリティ関数

| 関数                                      | 役割                  |
| ----------------------------------------- | --------------------- |
| `postRequest<Response>(url, body, form?)` | POST リクエストを送る |

### ヒント

:::details ヒント1
手順1の `postRequest` は、以下の引数で呼び出します。  
`exchangeCode` は引数で `code` と `state` を受け取っているので、そのまま渡しましょう。

```ts
postRequest<ExchangeResponse>("/exchange", { code, state });
```

:::

### 想定解答

:::details 想定解答

```ts
// TODO: Phase 1: OAuth
const exchangeCode = async (code: string, state: string): Promise<ExchangeResponse> => {
  return postRequest<ExchangeResponse>("/exchange", { code, state }); // [!code ++]
};
```

:::
