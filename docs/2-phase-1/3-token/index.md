# 2-3. token endpoint を実装する

OP の token endpoint を実装します。

## 実装するファイル

| ファイル                                                         | 関数         |
| ---------------------------------------------------------------- | ------------ |
| `templates/packages/openid-provider/server/routes/token.post.ts` | `tokenLogic` |

## `token.post.ts` の `tokenLogic` を実装する

code を受け取って、access token を発行します。

### 実装手順

1. `input.grantType` が `"authorization_code"` でなければ、`unsupported_grant_type` を`throw new Error()`する
2. `input.clientId` が `"rp-demo"` でなければ、`invalid_client` を`throw new Error()`する
3. `input.code` が空文字列なら、`invalid_request` を`throw new Error()`する
4. `getAuthCode` で保存された code を取得する。見つからなければ `invalid_grant` を`throw new Error()`する
5. 保存された `clientId` と `input.clientId` が一致しなければ、`invalid_grant` を`throw new Error()`する
6. `deleteAuthCode` で code を削除する
7. `findUser` でユーザーを取得し、`createAccessToken` で access token を作る
8. `access_token` / `token_type: "Bearer"` / `expires_in` を返す

### 使うユーティリティ関数

| 関数                        | 役割                    |
| --------------------------- | ----------------------- |
| `getAuthCode(code)`         | 認可コードを取得する    |
| `deleteAuthCode(code)`      | 認可コードを削除する    |
| `findUser(userId)`          | ユーザーを取得する      |
| `createAccessToken(claims)` | access token を発行する |

### ヒント

:::details ヒント1
手順4の code 取得は、見つからない場合に `invalid_grant` を投げます。

```ts
let stored: AuthCodePayload;
try {
  stored = await getAuthCode(input.code);
} catch {
  throw new Error("invalid_grant");
}
```

:::

:::details ヒント2
手順7の access token 発行は、以下の引数で呼び出します。

```ts
const user = await findUser(stored.id);
const accessToken = await createAccessToken({ sub: user.id, scope: stored.scope.join(" ") });
```

:::

### 想定解答

:::details 想定解答

```ts
// TODO: Phase 1: OAuth
const tokenLogic = async (input: TokenInput): Promise<TokenResponse> => {
  return {
    // [!code --]
    access_token: "", // [!code --]
    token_type: "Bearer", // [!code --]
    expires_in: 0, // [!code --]
  }; // [!code --]
  if (input.grantType !== "authorization_code") {
    // [!code ++]
    throw new Error("unsupported_grant_type"); // [!code ++]
  } // [!code ++]

  if (input.clientId !== "rp-demo") {
    // [!code ++]
    throw new Error("invalid_client"); // [!code ++]
  } // [!code ++]

  if (input.code === "") {
    // [!code ++]
    throw new Error("invalid_request"); // [!code ++]
  } // [!code ++]

  let stored: AuthCodePayload; // [!code ++]
  try {
    // [!code ++]
    stored = await getAuthCode(input.code); // [!code ++]
  } catch {
    // [!code ++]
    throw new Error("invalid_grant"); // [!code ++]
  } // [!code ++]

  if (stored.clientId !== input.clientId) {
    // [!code ++]
    throw new Error("invalid_grant"); // [!code ++]
  } // [!code ++]

  await deleteAuthCode(input.code); // [!code ++]

  const user = await findUser(stored.id); // [!code ++]
  const accessToken = await createAccessToken({ sub: user.id, scope: stored.scope.join(" ") }); // [!code ++]

  return {
    // [!code ++]
    access_token: accessToken, // [!code ++]
    token_type: "Bearer", // [!code ++]
    expires_in: ACCESS_TOKEN_TTL_SEC, // [!code ++]
  }; // [!code ++]
}; // [!code ++]
```

:::
