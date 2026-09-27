# Phase 1: OAuth (参考実装)

Phase 1 までの完成形です。OAuth 認可コードフローが実装されています（state / PKCE は未実装）。

## 起動方法

```bash
bun install
bun run dev
```

- OP: <http://localhost:3001>
- RP: <http://localhost:3000>

## 実装されている機能

- 認可コードフロー (OAuth 2.0)
