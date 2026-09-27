# 5-2. openid scope を許可する

OP の consent で `openid` scope を許可します。

## 実装するファイル

| ファイル                                                           | 関数           |
| ------------------------------------------------------------------ | -------------- |
| `templates/packages/openid-provider/server/routes/consent.post.ts` | `consentLogic` |

## `consent.post.ts` の `consentLogic` を実装する

許可する scope に `openid` を追加します。それ以外は Phase 3 と同じです。

### 実装手順

Phase 3 の `consentLogic` を前提に、以下の差分のみを変更します。他は Phase 3 と同じです。

1. （変更）scope 検証の許可リストを `["example"]` から `["openid", "example"]` に変える（他の検証・保存・リダイレクトはすべて Phase 3 と同じ）

### 使うユーティリティ関数

今回の差分では新しい関数は使いません。scope 検証の許可リストに `"openid"` を追加するだけです（他の関数はすべて Phase 3 と同じ使い方）。

### ヒント

:::details ヒント1
手順2の scope 検証は、許可リストに `"openid"` を追加します。

```ts
const scopes = input.scope.split(" ").filter((scope) => scope !== "");
if (scopes.some((scope) => !["openid", "example"].includes(scope))) {
  throw new Error("invalid_scope");
}
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
    throw new Error("invalid_request");
  }

  const scopes = input.scope.split(" ").filter((scope) => scope !== "");
  if (scopes.some((scope) => !["openid", "example"].includes(scope))) {
    // [!code ++]
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
    codeChallenge: input.codeChallenge,
    codeChallengeMethod: input.codeChallengeMethod,
    id: user.id,
  });

  const redirect = new URL("http://localhost:3000/callback");
  redirect.searchParams.set("code", code);
  redirect.searchParams.set("state", input.state);

  return { redirectTo: redirect.toString() };
};
```

:::
