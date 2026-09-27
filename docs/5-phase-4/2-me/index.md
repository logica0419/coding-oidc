# 5-2. /me API を実装する

セッションからユーザー情報を返す /me API を実装します。

## /me API を実装する

`templates/packages/relying-party/server/routes/me.get.ts` を実装します。

セッションからユーザー情報を返します。

```ts
// TODO: Phase 4: OIDC
const meLogic = async (event: H3Event): Promise<MeResponse> => {
  const session = await getUserSession(event);

  return { sub: session.id ?? "", name: session.name ?? "" };
};
```

::: details 参考実装

```ts
import type { H3Event } from "h3";

// TODO: Phase 4: OIDC
const meLogic = async (event: H3Event): Promise<MeResponse> => {
  const session = await getUserSession(event);

  return { sub: session.id ?? "", name: session.name ?? "" };
};

export default defineEventHandler((event) => {
  return meLogic(event);
});
```

:::

## index に現在のユーザーを表示する

`templates/packages/relying-party/app/pages/index.vue` を実装します。

`/me` からユーザー情報を取得して表示します。

```ts
const me = ref<MeResponse | null>(null);
const meError = ref("");
onMounted(async () => {
  try {
    me.value = await getRequest<MeResponse>("/me");
  } catch (error) {
    meError.value = error instanceof Error ? error.message : "me failed";
  }
});
```

```html
<p v-if="meError !== ''">ユーザー情報の取得に失敗しました: {{ meError }}</p>
<p v-else-if="me !== null">現在のユーザー: {{ me.name }} ({{ me.sub }})</p>
```

::: details 参考実装

```ts
const me = ref<MeResponse | null>(null);
const meError = ref("");
onMounted(async () => {
  try {
    me.value = await getRequest<MeResponse>("/me");
  } catch (error) {
    meError.value = error instanceof Error ? error.message : "me failed";
  }
});
```

:::
