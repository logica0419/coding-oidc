# 2-1. authorization URL を作る

RP から authorization endpoint にリダイレクトするための URL を作ります。

## 実装するファイル

| ファイル                                                                  | 関数                    |
| ------------------------------------------------------------------------- | ----------------------- |
| `templates/packages/relying-party/server/routes/authorization-url.get.ts` | `authorizationUrlLogic` |
| `templates/packages/relying-party/app/pages/index.vue`                    | `startLogin`            |

## `authorization-url.get.ts` の `authorizationUrlLogic` を実装する

authorization endpoint への URL を作り、必要なパラメータを付けます。

### 実装手順

1. `new URL("http://localhost:3001/authorize")` で authorization endpoint の URL を作る
2. `searchParams.set` で `response_type=code`、`client_id=rp-demo`、`scope=example` を付ける
3. `{ authorizeUrl: authorizeUrl.toString() }` を返す

### ヒント

:::details ヒント1
手順1〜2の URL 構築は、以下のように書きます。

```ts
const authorizeUrl = new URL("http://localhost:3001/authorize");
authorizeUrl.searchParams.set("response_type", "code");
authorizeUrl.searchParams.set("client_id", "rp-demo");
authorizeUrl.searchParams.set("scope", "example");
```

:::

### 想定解答

:::details 想定解答

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
const authorizationUrlLogic = async (event: H3Event): Promise<AuthorizationUrlResponse> => {
  return { authorizeUrl: "" }; // [!code --]
  const authorizeUrl = new URL("http://localhost:3001/authorize"); // [!code ++]
  authorizeUrl.searchParams.set("response_type", "code"); // [!code ++]
  authorizeUrl.searchParams.set("client_id", "rp-demo"); // [!code ++]
  authorizeUrl.searchParams.set("scope", "example"); // [!code ++]

  return { authorizeUrl: authorizeUrl.toString() }; // [!code ++]
}; // [!code ++]
```

:::

## `index.vue` の `startLogin` を実装する

`/authorization-url` から authorization URL を取得して、リダイレクトします。

### 実装手順

1. `getRequest` で `/authorization-url` から authorization URL を取得する
2. `redirectTo` で取得した URL にリダイレクトする

### 使うユーティリティ関数

| 関数                        | 役割                            |
| --------------------------- | ------------------------------- |
| `getRequest<Response>(url)` | GET リクエストを送る            |
| `redirectTo(url)`           | 指定した URL にリダイレクトする |

### ヒント

:::details ヒント1
手順1の `getRequest` は、以下の引数で呼び出します。

```ts
getRequest<AuthorizationUrlResponse>("/authorization-url");
```

:::

:::details ヒント2
手順2の `redirectTo` は、取得した `result.authorizeUrl` を渡して呼び出します。

```ts
redirectTo(result.authorizeUrl);
```

:::

### 想定解答

:::details 想定解答

```ts
// TODO: Phase 1: OAuth
const startLogin = async (): Promise<void> => {
  return; // [!code --]
  const result = await getRequest<AuthorizationUrlResponse>("/authorization-url"); // [!code ++]
  redirectTo(result.authorizeUrl); // [!code ++]
}; // [!code ++]
```

:::
