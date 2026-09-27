# 4-4. token endpoint で code_verifier を検証する

OP の token endpoint に code_verifier の検証を追加します。

## 実装するファイル

| ファイル                                                         | 関数         |
| ---------------------------------------------------------------- | ------------ |
| `templates/packages/openid-provider/server/routes/token.post.ts` | `tokenLogic` |

## `token.post.ts` の `tokenLogic` を実装する

code_verifier の SHA-256 ハッシュが、保存された code_challenge と一致することを検証します。

### 実装手順

Phase 1 の `tokenLogic` を前提に、以下の差分を追加します。既存の検証・取得・発行処理は Phase 1 と同じです。

1. （変更）空文字検証を `input.code` のみに加えて `input.codeVerifier` も対象にする
2. Phase 1 と同じく `getAuthCode` で code を取得する（変更なし）
3. Phase 1 と同じく `clientId` の一致を確認する（変更なし）
4. （追加）`createBase64EncodedHash(input.codeVerifier)` が保存された `codeChallenge` と一致しなければ、`invalid_grant` を`throw new Error()`する
5. Phase 1 と同じく `deleteAuthCode`・`findUser`・`createAccessToken` を行う（変更なし）

### 使うユーティリティ関数

今回の差分で使う関数のみ記載します（`getAuthCode` / `deleteAuthCode` / `findUser` / `createAccessToken` は Phase 1 と同じ使い方のため省略）。

| 関数                             | 役割                                        |
| -------------------------------- | ------------------------------------------- |
| `createBase64EncodedHash(value)` | SHA-256 ハッシュを base64url エンコードする |

### ヒント

:::details ヒント1
手順1の空文字検証は、`code` と `codeVerifier` の両方を確認します。

```ts
if (input.code === "" || input.codeVerifier === "") {
  throw new Error("invalid_request");
}
```

:::

:::details ヒント2
手順4の PKCE 検証は、code_verifier から code_challenge を再計算して比較します。

```ts
const expected = createBase64EncodedHash(input.codeVerifier);
if (expected !== stored.codeChallenge) {
  throw new Error("invalid_grant");
}
```

:::

### 想定解答

:::details 想定解答

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 3: PKCE
const tokenLogic = async (input: TokenInput): Promise<TokenResponse> => {
  if (input.grantType !== "authorization_code") {
    throw new Error("unsupported_grant_type");
  }

  if (input.clientId !== "rp-demo") {
    throw new Error("invalid_client");
  }

  if (input.code === "" || input.codeVerifier === "") { // [!code ++]
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

  const expected = createBase64EncodedHash(input.codeVerifier); // [!code ++]
  if (expected !== stored.codeChallenge) { // [!code ++]
    throw new Error("invalid_grant"); // [!code ++]
  } // [!code ++]

  await deleteAuthCode(input.code);

  const user = await findUser(stored.id);
  const accessToken = await createAccessToken({ sub: user.id, scope: stored.scope.join(" ") });

  return {
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_TTL_SEC,
  };
};
```

:::
