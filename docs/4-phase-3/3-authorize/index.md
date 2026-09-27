# 4-3. 認可ページから code_challenge を送信する

認可ページから consent に code_challenge を送信します。

## 実装するファイル

| ファイル                                                     | 関数          |
| ------------------------------------------------------------ | ------------- |
| `templates/packages/openid-provider/app/pages/authorize.vue` | `grantAccess` |

## `authorize.vue` の `grantAccess` を実装する

クエリの `code_challenge` と `code_challenge_method` を consent リクエストに含めます。

### 実装手順

Phase 2 の `grantAccess` を前提に、以下の差分を追加します。

1. （変更）`postRequest` の送信内容に `code_challenge: input.codeChallenge` と `code_challenge_method: input.codeChallengeMethod` を追加する（他は Phase 2 と同じ）
2. Phase 2 と同じく `redirectTo` で `result.redirectTo` にリダイレクトする（変更なし）

### 使うユーティリティ関数

今回の差分では新しい関数は使いません。`postRequest` の送信内容に `code_challenge` / `code_challenge_method` を追加するだけです（`postRequest` / `redirectTo` 自体は Phase 2 と同じ使い方）。

### ヒント

:::details ヒント1
手順1の `postRequest` は、Phase 2 の送信内容に `code_challenge` と `code_challenge_method` を追加します。

```ts
postRequest<ConsentResponse>("/consent", {
  response_type: input.responseType,
  client_id: input.clientId,
  scope: input.scope,
  state: input.state,
  code_challenge: input.codeChallenge,
  code_challenge_method: input.codeChallengeMethod,
  user_id: userId,
});
```

`input` にはクエリの `code_challenge` がすでに入っているので、そのまま渡しましょう。

:::

### 想定解答

:::details 想定解答

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
const grantAccess = async (userId: string, input: ConsentInput): Promise<void> => {
  const result = await postRequest<ConsentResponse>("/consent", {
    response_type: input.responseType,
    client_id: input.clientId,
    scope: input.scope,
    state: input.state,
    code_challenge: input.codeChallenge, // [!code ++]
    code_challenge_method: input.codeChallengeMethod, // [!code ++]
    user_id: userId,
  });

  redirectTo(result.redirectTo);
};
```

:::
