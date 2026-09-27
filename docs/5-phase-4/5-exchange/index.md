# 5-5. ID Token を検証してセッションに保存する

RP の exchange に ID Token の検証を追加します。

## 実装するファイル

| ファイル                                                          | 関数            |
| ----------------------------------------------------------------- | --------------- |
| `templates/packages/relying-party/server/routes/exchange.post.ts` | `exchangeLogic` |

## `exchange.post.ts` の `exchangeLogic` を実装する

JWKS を取得して ID Token を検証し、ユーザー情報（sub / name）をセッションに保存します。

### 実装手順

Phase 3 の `exchangeLogic` を前提に、以下の差分を追加します。既存の検証・token 取得は Phase 3 と同じです。

1. Phase 3 と同じ検証・state 検証・`deleteAuthRequest`・`postRequest` を行う（変更なし）
2. （追加）`token.id_token` が `undefined` なら、`missing id_token` を投げる
3. （追加）`getRequest` で JWKS (`http://localhost:3001/.well-known/jwks.json`) を取得する
4. （追加）`verifyIdToken(token.id_token, jwks.keys[0])` で ID Token を検証する
5. （変更）`setUserSession` の保存内容を `accessToken` のみに加えて `id: claims.sub` と `name: claims.name` も保存する

### 使うユーティリティ関数

今回の差分で使う関数のみ記載します（`getAuthRequest` / `deleteAuthRequest` / `postRequest` / `setUserSession` は Phase 3 と同じ使い方のため省略）。

| 関数                          | 役割                 |
| ----------------------------- | -------------------- |
| `getRequest<Response>(url)`   | GET リクエストを送る |
| `verifyIdToken(idToken, jwk)` | ID Token を検証する  |

### ヒント

:::details ヒント1
手順3の ID Token 存在確認は、以下のように書きます。

```ts
if (token.id_token === undefined) {
  throw new Error("missing id_token");
}
```

:::

:::details ヒント2
手順4〜5の JWKS 取得と ID Token 検証は、以下のように書きます。

```ts
const jwks = await getRequest<JwksDocument>("http://localhost:3001/.well-known/jwks.json");
const claims = await verifyIdToken(token.id_token, jwks.keys[0]);
```

:::

:::details ヒント3
手順6の `setUserSession` は、検証結果の `claims.sub` と `claims.name` を保存します。

```ts
await setUserSession(event, {
  id: claims.sub,
  name: claims.name,
  accessToken: token.access_token,
});
```

:::

### 想定解答

:::details 想定解答

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
    "http://localhost:3001/token",
    {
      grant_type: "authorization_code",
      code: input.code,
      client_id: "rp-demo",
      code_verifier: authRequest.codeVerifier ?? "",
    },
    true,
  );
  if (token.id_token === undefined) {
    // [!code ++]
    throw new Error("missing id_token"); // [!code ++]
  } // [!code ++]

  const jwks = await getRequest<JwksDocument>("http://localhost:3001/.well-known/jwks.json"); // [!code ++]
  const claims = await verifyIdToken(token.id_token, jwks.keys[0]); // [!code ++]

  await setUserSession(event, {
    // [!code ++]
    id: claims.sub, // [!code ++]
    name: claims.name, // [!code ++]
    accessToken: token.access_token,
  }); // [!code ++]

  return { message: "交換できました！" };
};
```

:::
