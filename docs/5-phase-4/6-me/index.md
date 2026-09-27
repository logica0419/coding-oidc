# 5-6. /me API を実装する

セッションからユーザー情報を返す /me API を実装します。

## 実装するファイル

| ファイル                                                   | 関数      |
| ---------------------------------------------------------- | --------- |
| `templates/packages/relying-party/server/routes/me.get.ts` | `meLogic` |

## `me.get.ts` の `meLogic` を実装する

セッションからユーザー情報を返します。

### 実装手順

1. `getUserSession` でセッションを取得する
2. `{ sub: session.id, name: session.name }` を返す

### 使うユーティリティ関数

| 関数                    | 役割                 |
| ----------------------- | -------------------- |
| `getUserSession(event)` | セッションを取得する |

### ヒント

:::details ヒント1
手順1〜2は、以下のように書きます。

```ts
const session = await getUserSession(event);

return { sub: session.id, name: session.name };
```

:::

### 想定解答

:::details 想定解答

```ts
// TODO: Phase 4: OIDC
const meLogic = async (event: H3Event): Promise<MeResponse> => {
  return { sub: "", name: "" }; // [!code --]
  const session = await getUserSession(event); // [!code ++]

  return { sub: session.id, name: session.name }; // [!code ++]
}; // [!code ++]
```

:::
