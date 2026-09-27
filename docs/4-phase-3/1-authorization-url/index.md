# 4-1. authorization URL に PKCE を付ける

RP の authorization URL に PKCE パラメータを付けます。

## 実装するファイル

| ファイル                                                                  | 関数                    |
| ------------------------------------------------------------------------- | ----------------------- |
| `templates/packages/relying-party/server/routes/authorization-url.get.ts` | `authorizationUrlLogic` |

## `authorization-url.get.ts` の `authorizationUrlLogic` を実装する

code_verifier を生成し、SHA-256 ハッシュを base64url エンコードした code_challenge を計算して、authorization URL に付けます。

### 実装手順

Phase 2 の `authorizationUrlLogic` を前提に、以下の差分を追加します。state 生成・URL 構築の基本部分は Phase 2 と同じです。

1. Phase 2 と同じく `randomString(16)` で state を生成する（変更なし）
2. （追加）`randomString(64)` で code_verifier を生成する
3. （追加）`createBase64EncodedHash(codeVerifier)` で code_challenge を計算する
4. （変更）`setAuthRequest` の保存内容を `{ state }` から `{ state, codeVerifier }` に変える
5. Phase 2 と同じ URL 構築を行う（変更なし）
6. （追加）`searchParams.set` で `code_challenge` と `code_challenge_method=S256` を付ける（他は Phase 2 と同じ）
7. Phase 2 と同じく `{ authorizeUrl: authorizeUrl.toString() }` を返す（変更なし）

### 使うユーティリティ関数

今回の差分で使う関数のみ記載します（`randomString` の state 生成・`setAuthRequest` の基本形・URL 構築は Phase 2 と同じため省略）。

| 関数                             | 役割                                        |
| -------------------------------- | ------------------------------------------- |
| `createBase64EncodedHash(value)` | SHA-256 ハッシュを base64url エンコードする |

### ヒント

:::details ヒント1
手順2〜3の code_verifier 生成と code_challenge 計算は、以下のように書きます。

```ts
const codeVerifier = randomString(64);
const codeChallenge = createBase64EncodedHash(codeVerifier);
```

:::

:::details ヒント2
手順4の `setAuthRequest` は、state に加えて codeVerifier を保存します。

```ts
await setAuthRequest(event, { state, codeVerifier });
```

:::

:::details ヒント3
手順6の URL 構築は、Phase 2 の URL に `code_challenge` と `code_challenge_method` を追加します。

```ts
authorizeUrl.searchParams.set("code_challenge", codeChallenge);
authorizeUrl.searchParams.set("code_challenge_method", "S256");
```

:::

### 想定解答

:::details 想定解答

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
// TODO: Phase 3: PKCE
const authorizationUrlLogic = async (event: H3Event): Promise<AuthorizationUrlResponse> => {
  const state = randomString(16);
  const codeVerifier = randomString(64); // [!code ++]
  const codeChallenge = createBase64EncodedHash(codeVerifier); // [!code ++]

  await setAuthRequest(event, { state, codeVerifier }); // [!code ++]

  const authorizeUrl = new URL("http://localhost:3001/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", "rp-demo");
  authorizeUrl.searchParams.set("scope", "example");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("code_challenge", codeChallenge); // [!code ++]
  authorizeUrl.searchParams.set("code_challenge_method", "S256"); // [!code ++]

  return { authorizeUrl: authorizeUrl.toString() };
};
```

:::
