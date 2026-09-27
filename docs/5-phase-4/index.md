# 5. Phase 4: OIDC

OIDC (OpenID Connect) を実装します。ID Token を発行・検証して、ユーザー情報を取得します。

## 実装する仕様

- Phase 3 の実装に加えて、scope に openid を追加して、ID Token を取得する
- /me API を実装して、セッションからユーザー情報を返す
- [実験] ID Token を検証して、ユーザー情報を取得できることを確認する

## 今の状態確認

Phase 3 の実装が完了した状態です。OAuth 認可コードフロー + state + PKCE は動きますが、ID Token がありません。

## 目次

- [5-1. ID Token を実装する](./1-id-token/)
- [5-2. /me API を実装する](./2-me/)

## 実装後の状態確認

1. `bun run dev` で OP と RP を起動する
2. <http://localhost:3100> にアクセスして、ログインフローを一通り実行する
3. ホームに戻ると「現在のユーザー: ユーザー1 (user1)」と表示されることを確認する
4. [実験] ID Token を検証して、ユーザー情報を取得できることを確認する
