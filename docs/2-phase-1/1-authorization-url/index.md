# 2-1. authorization URL を作る

RP から authorization endpoint にリダイレクトするための URL を作ります。

## authorization URL を作る

`templates/packages/relying-party/server/routes/authorization-url.get.ts` の `authorizationUrlLogic` を実装します。

authorization endpoint への URL を作り、必要なパラメータを付けます。

```ts
// TODO: Phase 1: OAuth
// TODO: Phase 2: state
const authorizationUrlLogic = async (event: H3Event): Promise<AuthorizationUrlResponse> => {
  const authorizeUrl = new URL("http://localhost:3101/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", "rp-demo");
  authorizeUrl.searchParams.set("scope", "example");

  return { authorizeUrl: authorizeUrl.toString() };
};
```

::: details 参考実装

```ts
import type { H3Event } from "h3";

// TODO: Phase 1: OAuth
// TODO: Phase 2: state
const authorizationUrlLogic = async (event: H3Event): Promise<AuthorizationUrlResponse> => {
  const authorizeUrl = new URL("http://localhost:3101/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", "rp-demo");
  authorizeUrl.searchParams.set("scope", "example");

  return { authorizeUrl: authorizeUrl.toString() };
};

export default defineEventHandler((event) => {
  return authorizationUrlLogic(event);
});
```

:::

## index からリダイレクトする

`templates/packages/relying-party/app/pages/index.vue` の `startLogin` を実装します。

`/authorization-url` から authorization URL を取得して、リダイレクトします。

```ts
// TODO: Phase 1: OAuth
const startLogin = async (): Promise<void> => {
  const result = await getRequest<AuthorizationUrlResponse>("/authorization-url");
  redirectTo(result.authorizeUrl);
};
```

::: details 参考実装

```ts
// TODO: Phase 1: OAuth
const startLogin = async (): Promise<void> => {
  const result = await getRequest<AuthorizationUrlResponse>("/authorization-url");
  redirectTo(result.authorizeUrl);
};
```

:::
