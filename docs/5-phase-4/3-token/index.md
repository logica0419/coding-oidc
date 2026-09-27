# 5-3. ID Token を発行する

OP の token endpoint に ID Token の発行を追加します。

## 実装するファイル

| ファイル                                                         | 関数         |
| ---------------------------------------------------------------- | ------------ |
| `templates/packages/openid-provider/server/routes/token.post.ts` | `tokenLogic` |

## `token.post.ts` の `tokenLogic` を実装する

scope に openid が含まれる場合のみ、ID Token を発行してレスポンスに含めます。

### 実装手順

Phase 3 の `tokenLogic` を前提に、以下の差分を追加します。既存の検証・PKCE 検証・access token 発行は Phase 3 と同じです。

1. Phase 3 と同じ検証・PKCE 検証・`deleteAuthCode`・`createAccessToken` を行う（変更なし）
2. （追加）`stored.scope` に `"openid"` が含まれなければ、ID Token なしで返す
3. （追加）`createIdToken({ sub: user.id, name: user.name })` で ID Token を作り、`id_token` 付きで返す

### 使うユーティリティ関数

今回の差分で使う関数のみ記載します（`getAuthCode` / `deleteAuthCode` / `findUser` / `createBase64EncodedHash` / `createAccessToken` は Phase 3 と同じ使い方のため省略）。

| 関数                    | 役割                |
| ----------------------- | ------------------- |
| `createIdToken(claims)` | ID Token を発行する |

### ヒント

:::details ヒント1
手順3の openid 判定は、以下のように書きます。

```ts
if (!stored.scope.includes("openid")) {
  return {
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_TTL_SEC,
  };
}
```

:::

:::details ヒント2
手順4の ID Token 発行は、以下の引数で呼び出します。

```ts
const idToken = await createIdToken({ sub: user.id, name: user.name });
```

:::

### 想定解答

:::details 想定解答

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 3: PKCE
// TODO: Phase 4: OIDC
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

  if (!stored.scope.includes("openid")) { // [!code ++]
    return { // [!code ++]
      access_token: accessToken, // [!code ++]
      token_type: "Bearer", // [!code ++]
      expires_in: ACCESS_TOKEN_TTL_SEC, // [!code ++]
    }; // [!code ++]
  } // [!code ++]

  const idToken = await createIdToken({ sub: user.id, name: user.name }); // [!code ++]
  return { // [!code ++]
    access_token: accessToken, // [!code ++]
    token_type: "Bearer", // [!code ++]
    expires_in: ACCESS_TOKEN_TTL_SEC, // [!code ++]
    id_token: idToken, // [!code ++]
  }; // [!code ++]
};
```

:::
