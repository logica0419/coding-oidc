# 5-4. JWKS endpoint を公開する

ID Token の検証に使う公開鍵を JWKS 形式で公開します。

## 実装するファイル

| ファイル                                                                       | 関数        |
| ------------------------------------------------------------------------------ | ----------- |
| `templates/packages/openid-provider/server/routes/well-known/jwks.json.get.ts` | `jwksLogic` |

## `jwks.json.get.ts` の `jwksLogic` を実装する

公開鍵を JWKS 形式で返します。

### 実装手順

1. `getJWTPublicKey()` の結果をそのまま返す

### 使うユーティリティ関数

| 関数                | 役割                         |
| ------------------- | ---------------------------- |
| `getJWTPublicKey()` | JWT 検証用の公開鍵を取得する |

### ヒント

:::details ヒント1
手順1は一行だけです。`getJWTPublicKey` は引数なしで呼び出します。

```ts
return getJWTPublicKey();
```

:::

### 想定解答

:::details 想定解答

```ts
// TODO: Phase 4: OIDC
const jwksLogic = async (): Promise<JwksDocument> => {
  return { keys: [] }; // [!code --]
  return getJWTPublicKey(); // [!code ++]
}; // [!code ++]
```

:::
