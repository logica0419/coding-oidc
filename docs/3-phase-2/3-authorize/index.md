# 3-3. 認可ページから state を送信する

認可ページから consent に state を送信します。

## 実装するファイル

| ファイル                                                     | 関数          |
| ------------------------------------------------------------ | ------------- |
| `templates/packages/openid-provider/app/pages/authorize.vue` | `grantAccess` |

## `authorize.vue` の `grantAccess` を実装する

クエリの `state` を consent リクエストに含めます。

### 実装手順

Phase 1 の `grantAccess` を前提に、以下の差分を追加します。

1. （変更）`postRequest` の送信内容に `state: input.state` を追加する（`response_type` / `client_id` / `scope` / `user_id` は Phase 1 と同じ）
2. Phase 1 と同じく `redirectTo` で `result.redirectTo` にリダイレクトする（変更なし）

### 使うユーティリティ関数

今回の差分では新しい関数は使いません。`postRequest` の送信内容に `state` を追加するだけです（`postRequest` / `redirectTo` 自体は Phase 1 と同じ使い方）。

### ヒント

:::details ヒント1
手順1の `postRequest` は、Phase 1 の送信内容に `state: input.state` を追加します。

```ts
postRequest<ConsentResponse>("/consent", {
  response_type: input.responseType,
  client_id: input.clientId,
  scope: input.scope,
  state: input.state,
  user_id: userId,
});
```

`input` にはクエリの `state` がすでに入っているので、そのまま渡しましょう。

:::

### 想定解答

:::details 想定解答

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
const grantAccess = async (userId: string, input: ConsentInput): Promise<void> => {
  const result = await postRequest<ConsentResponse>("/consent", {
    response_type: input.responseType,
    client_id: input.clientId,
    scope: input.scope,
    state: input.state, // [!code ++]
    user_id: userId,
  });

  redirectTo(result.redirectTo);
};
```

:::
