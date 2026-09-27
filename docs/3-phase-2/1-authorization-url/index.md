# 3-1. authorization URL に state を付ける

RP の authorization URL に state を付けます。

## 実装するファイル

| ファイル                                                                  | 関数                    |
| ------------------------------------------------------------------------- | ----------------------- |
| `templates/packages/relying-party/server/routes/authorization-url.get.ts` | `authorizationUrlLogic` |

## `authorization-url.get.ts` の `authorizationUrlLogic` を実装する

state を生成して cookie に保存し、authorization URL に付けます。

### 実装手順

Phase 1 の `authorizationUrlLogic` を前提に、以下の差分を追加します。URL 構築自体は Phase 1 と同じです。

1. （追加）`randomString(16)` で state を生成する
2. （追加）`setAuthRequest` で `{ state }` を保存する
3. Phase 1 と同じ URL 構築を行う（変更なし）
4. （追加）`searchParams.set` で `state` を付ける（`response_type` / `client_id` / `scope` は Phase 1 と同じ）
5. Phase 1 と同じく `{ authorizeUrl: authorizeUrl.toString() }` を返す（変更なし）

### 使うユーティリティ関数

今回の差分で使う関数のみ記載します（URL 構築は Phase 1 と同じため省略）。

| 関数                             | 役割                                      |
| -------------------------------- | ----------------------------------------- |
| `randomString(length)`           | ランダムな文字列を生成する（state 用）    |
| `setAuthRequest(event, payload)` | 認可リクエストを保存する (cookie + Redis) |

### ヒント

:::details ヒント1
手順1〜2の state 生成と保存は、以下のように書きます。

```ts
const state = randomString(16);

await setAuthRequest(event, { state });
```

:::

:::details ヒント2
手順3〜4の URL 構築は、Phase 1 の URL に `state` を追加します。

```ts
const authorizeUrl = new URL("http://localhost:3001/authorize");
authorizeUrl.searchParams.set("response_type", "code");
authorizeUrl.searchParams.set("client_id", "rp-demo");
authorizeUrl.searchParams.set("scope", "example");
authorizeUrl.searchParams.set("state", state);
```

:::

### 想定解答

:::details 想定解答

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
const authorizationUrlLogic = async (event: H3Event): Promise<AuthorizationUrlResponse> => {
  const state = randomString(16); // [!code ++]

  await setAuthRequest(event, { state }); // [!code ++]

  const authorizeUrl = new URL("http://localhost:3001/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", "rp-demo");
  authorizeUrl.searchParams.set("scope", "example");
  authorizeUrl.searchParams.set("state", state); // [!code ++]

  return { authorizeUrl: authorizeUrl.toString() };
};
```

:::
