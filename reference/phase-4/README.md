# Phase 4: OIDC (参考実装)

Phase 4 までの完成形です。OAuth 認可コードフロー + state + PKCE + OIDC (ID Token) が全て実装されています。

## 起動方法

```bash
bun install
bun run dev
```

- OP: <http://localhost:3101>
- RP: <http://localhost:3100>

## 実装されている機能

- 認可コードフロー (OAuth 2.0)
- state による CSRF 対策
- PKCE (S256) によるコード乗っ取り対策
- ID Token の発行・検証 (OIDC)
