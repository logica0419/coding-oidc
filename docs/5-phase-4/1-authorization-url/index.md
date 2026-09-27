# 5-1. scope に openid を追加する

RP の authorization URL の scope に `openid` を追加します。

## 実装するファイル

| ファイル                                                                  | 関数                    |
| ------------------------------------------------------------------------- | ----------------------- |
| `templates/packages/relying-party/server/routes/authorization-url.get.ts` | `authorizationUrlLogic` |

## `authorization-url.get.ts` の `authorizationUrlLogic` を実装する

scope に `openid` を追加します。それ以外は Phase 3 と同じです。

### 実装手順

Phase 3 の `authorizationUrlLogic` を前提に、以下の差分のみを変更します。他は Phase 3 と同じです。

1. （変更）`searchParams.set` の `scope` を `"example"` から `"openid example"` に変える（他の手順はすべて Phase 3 と同じ）

### 使うユーティリティ関数

今回の差分では新しい関数は使いません。`searchParams.set` の `scope` を変えるだけです（他の関数はすべて Phase 3 と同じ使い方）。

### ヒント

:::details ヒント1
手順6の scope 設定は、以下の一行を変更します。

```ts
authorizeUrl.searchParams.set("scope", "openid example");
```

:::

### 想定解答

:::details 想定解答

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
// TODO: Phase 4: OIDC
const authorizationUrlLogic = async (event: H3Event): Promise<AuthorizationUrlResponse> => {
  const state = randomString(16);
  const codeVerifier = randomString(64);
  const codeChallenge = createBase64EncodedHash(codeVerifier);

  await setAuthRequest(event, { state, codeVerifier });

  const authorizeUrl = new URL("http://localhost:3001/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", "rp-demo");
  authorizeUrl.searchParams.set("scope", "openid example"); // [!code ++]
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("code_challenge", codeChallenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");

  return { authorizeUrl: authorizeUrl.toString() };
};
```

:::
