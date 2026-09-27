# 4-2. consent に PKCE を追加する

OP の consent に code_challenge の検証と保存を追加します。

## 実装するファイル

| ファイル                                                           | 関数           |
| ------------------------------------------------------------------ | -------------- |
| `templates/packages/openid-provider/server/routes/consent.post.ts` | `consentLogic` |

## `consent.post.ts` の `consentLogic` を実装する

code_challenge が必須で、code_challenge_method が S256 であることを検証し、auth code に保存します。

### 実装手順

Phase 2 の `consentLogic` を前提に、以下の差分を追加します。既存の検証・ユーザー取得・リダイレクトは Phase 2 と同じです。

1. Phase 2 と同じ検証（`responseType` / `clientId` / `state` / `scope` / `userId`）を行う（変更なし）
2. （追加）`input.codeChallenge` が空文字列、または `input.codeChallengeMethod` が `"S256"` でなければ、`invalid_request` を`throw new Error()`する
3. Phase 2 と同じく `findUser` でユーザーを取得し、`randomString(32)` で code を作る（変更なし）
4. （変更）`setAuthCode` の保存内容に `codeChallenge` と `codeChallengeMethod` を追加する（他は Phase 2 と同じ）
5. Phase 2 と同じく `code` と `state` を付けて返す（変更なし）

### 使うユーティリティ関数

今回の差分では新しい関数は使いません。`setAuthCode` の保存内容に `codeChallenge` / `codeChallengeMethod` を追加するだけです（`findUser` / `randomString` / `setAuthCode` 自体は Phase 2 と同じ使い方）。

### ヒント

:::details ヒント1
手順2の code_challenge 検証は、以下の一行を追加します。

```ts
if (input.codeChallenge === "" || input.codeChallengeMethod !== "S256") {
  throw new Error("invalid_request");
}
```

:::

:::details ヒント2
手順4の `setAuthCode` は、Phase 2 の保存内容に `codeChallenge` と `codeChallengeMethod` を追加します。

```ts
await setAuthCode(code, {
  clientId: input.clientId,
  scope: scopes,
  state: input.state,
  codeChallenge: input.codeChallenge,
  codeChallengeMethod: input.codeChallengeMethod,
  id: user.id,
});
```

:::

### 想定解答

:::details 想定解答

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
const consentLogic = async (input: ConsentInput): Promise<ConsentResponse> => {
  if (input.responseType !== "code") {
    throw new Error("unsupported_response_type");
  }

  if (input.clientId !== "rp-demo") {
    throw new Error("invalid_client");
  }

  if (input.state === "") {
    throw new Error("invalid_request");
  }

  if (input.codeChallenge === "" || input.codeChallengeMethod !== "S256") {
    // [!code ++]
    throw new Error("invalid_request"); // [!code ++]
  } // [!code ++]

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
    state: input.state,
    codeChallenge: input.codeChallenge, // [!code ++]
    codeChallengeMethod: input.codeChallengeMethod, // [!code ++]
    id: user.id,
  });

  const redirect = new URL("http://localhost:3000/callback");
  redirect.searchParams.set("code", code);
  redirect.searchParams.set("state", input.state);

  return { redirectTo: redirect.toString() };
};
```

:::
