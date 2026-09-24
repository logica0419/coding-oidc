# OAuth / OIDC 自作入門 ハンズオン用テンプレート

ハンズオンパートで使う作業用テンプレートです。

```plain
.
├── openid-provider   OP (未完成版、http://localhost:3101)
├── relying-party     RP (未完成版、http://localhost:3100)
├── packages/shared   共有型・定数
└── .devcontainer     Dev Container 定義ファイル (作業コンテナ + Redis 定義含む)
```

## 必要なもの

- Docker
- VS Code + Dev Containers 拡張

Dev Container で開くと、作業コンテナと Redis が起動し、`bun install` が実行されます。

## コマンド一覧

- 2つのアプリを同時に起動

```bash
bun run dev
```

- OP のみ起動 (<http://localhost:3101>)

```bash
bun run dev:op
```

- RP のみ起動 (<http://localhost:3100>)

```bash
bun run dev:rp
```

- ビルド

```bash
bun run build
```

- 型チェック

```bash
bun run check
```
