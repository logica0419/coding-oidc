# Phase 3: PKCE (参考実装)

Phase 3 までの完成形です。OAuth 認可コードフロー + state + PKCE が実装されています（OIDC は未実装）。

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
