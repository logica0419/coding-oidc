# 3-2. consent に state を追加する

OP の consent に state の検証と保存を追加します。

## 実装するファイル

| ファイル                                                           | 関数           |
| ------------------------------------------------------------------ | -------------- |
| `templates/packages/openid-provider/server/routes/consent.post.ts` | `consentLogic` |

## `consent.post.ts` の `consentLogic` を実装する

state を auth code に保存し、リダイレクト URL にも state を付けます。

### 実装手順

Phase 1 の `consentLogic` を前提に、以下の差分を追加します。検証・ユーザー取得・code 生成は Phase 1 と同じです。

1. Phase 1 と同じ検証（`responseType` / `clientId` / `scope` / `userId`）を行う（変更なし）
2. （追加）`input.state` が空文字列なら、`invalid_request` を投げる
3. Phase 1 と同じく `findUser` でユーザーを取得し、`randomString(32)` で code を作る（変更なし）
4. （変更）`setAuthCode` の保存内容に `state: input.state` を追加する（他は Phase 1 と同じ）
5. （変更）リダイレクト URL に `state` を追加する（`code` の付与は Phase 1 と同じ）

### 使うユーティリティ関数

今回の差分では新しい関数は使いません。`setAuthCode` の保存内容に `state` を追加するだけです（`findUser` / `randomString` / `setAuthCode` 自体は Phase 1 と同じ使い方）。

### ヒント

:::details ヒント1
手順2の state 検証は、以下の一行を追加します。

```ts
if (input.state === "") {
  throw new Error("invalid_request");
}
```

:::

:::details ヒント2
手順4の `setAuthCode` は、Phase 1 の保存内容に `state: input.state` を追加します。

```ts
await setAuthCode(code, {
  clientId: input.clientId,
  scope: scopes,
  state: input.state,
  id: user.id,
});
```

:::

:::details ヒント3
手順5のリダイレクト URL 構築は、`code` に加えて `state` を付けます。

```ts
const redirect = new URL("http://localhost:3000/callback");
redirect.searchParams.set("code", code);
redirect.searchParams.set("state", input.state);
```

:::

### 想定解答

:::details 想定解答

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

  if (input.state === "") {
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
    state: input.state, // [!code ++]
    id: user.id,
  });

  const redirect = new URL("http://localhost:3000/callback");
  redirect.searchParams.set("code", code);
  redirect.searchParams.set("state", input.state); // [!code ++]

  return { redirectTo: redirect.toString() };
};
```

:::
