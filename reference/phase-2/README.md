# Phase 2: state (参考実装)

Phase 2 までの完成形です。OAuth 認可コードフロー + state が実装されています（PKCE は未実装）。

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
