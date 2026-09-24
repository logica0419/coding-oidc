# OAuth / OIDC 自作入門

OAuth / OIDC の仕組みを手を動かして理解するワークショップのリポジトリです。
OpenID Provider (OP) と Relying Party (RP) を自作し、認可コードフロー + PKCE を動かします。

## `/templates`: ハンズオン用テンプレート

ハンズオンパートで使う作業用テンプレートです。
詳細は [README.md](./templates/README.md) を参照して下さい。

```plain
templates
├── openid-provider   OP (未完成版)
├── relying-party     RP (未完成版)
├── packages/shared   共有型・定数
├── compose.yaml      作業コンテナ + Redis 定義
└── .devcontainer     Dev Container 定義ファイル
```

`init.sh` でこのディレクトリだけを取り出して使います。

```bash
./init.sh /path/to/workdir
```

## `/reference`: 参考実装

ハンズオンパートで実装する OP / RP の参考実装です。(準備中)

## `/docs`: 教材

この講座の教材です。
Bun と VitePress でレンダリングすることを前提としています。

```bash
bun run docs:dev
```
