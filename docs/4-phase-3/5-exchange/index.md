# 4-5. token リクエストに code_verifier を付ける

RP の token リクエストに code_verifier を付けます。

## 実装するファイル

| ファイル                                                          | 関数            |
| ----------------------------------------------------------------- | --------------- |
| `templates/packages/relying-party/server/routes/exchange.post.ts` | `exchangeLogic` |

## `exchange.post.ts` の `exchangeLogic` を実装する

token リクエストに保存した code_verifier を含めます。

### 実装手順

Phase 2 の `exchangeLogic` を前提に、以下の差分を追加します。state 検証・セッション保存・返却は Phase 2 と同じです。

1. Phase 2 と同じ検証・state 検証・`deleteAuthRequest` を行う（変更なし）
2. （変更）`postRequest` の送信内容に `code_verifier: authRequest.codeVerifier ?? ""` を追加する（他は Phase 2 と同じ）
3. Phase 2 と同じく `setUserSession` で保存する（変更なし）
4. Phase 2 と同じく `{ message: "交換できました！" }` を返す（変更なし）

### 使うユーティリティ関数

今回の差分では新しい関数は使いません。`postRequest` の送信内容に `code_verifier` を追加するだけです（`getAuthRequest` / `deleteAuthRequest` / `postRequest` / `setUserSession` 自体は Phase 2 と同じ使い方）。

### ヒント

:::details ヒント1
手順2の `postRequest` は、Phase 2 の送信内容に `code_verifier` を追加します。  
保存した `authRequest.codeVerifier` が `undefined` の場合に備えて、`?? ""` を付けましょう。

```ts
postRequest<TokenResponse>(
  "http://localhost:3001/token",
  {
    grant_type: "authorization_code",
    code: input.code,
    client_id: "rp-demo",
    code_verifier: authRequest.codeVerifier ?? "",
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
    "http://localhost:3001/token",
    {
      grant_type: "authorization_code",
      code: input.code,
      client_id: "rp-demo",
      code_verifier: authRequest.codeVerifier ?? "", // [!code ++]
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
