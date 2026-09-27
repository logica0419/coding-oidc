# 2. Phase 1: OAuth

OAuth 2.0 の認可コードフローを実装します。

## 実装する仕様

- RP の index から、authorization endpoint にリダイレクトして、code を受け取る
- RP の callback で、code を受け取って、token endpoint にリクエストして、access token を受け取る
- [実験] index から「/api/example にアクセスする」ボタンを押すと、access token を使って /api/example にアクセスできることを確認する

## 今の状態確認

`bun run dev` で OP と RP を起動して、<http://localhost:3000> と <http://localhost:3001> にアクセスしてみましょう。

- RP の「opを使ってログインする」ボタンを押しても何も起きません（`startLogin` が空実装のため）
- OP の認可ページで「許可する」を押しても何も起きません（`grantAccess` が空実装のため）

## 目次

- [2-1. authorization URL を作る](./1-authorization-url/)
- [2-2. code を発行する](./2-consent/)
- [2-3. token endpoint を実装する](./3-token/)
- [2-4. code を token に交換する](./4-exchange/)

## 実装後の状態確認

1. `bun run dev` で OP と RP を起動する
2. <http://localhost:3100> にアクセスする
3. 「opを使ってログインする」を押すと、OP の認可ページにリダイレクトされる
4. ユーザーを選んで「許可する」を押すと、RP の callback ページにリダイレクトされる
5. 「コードをトークンに交換する」を押すと「交換できました！」と表示される
6. ホームに戻って「/api/example にアクセスする」を押すと「access granted!」と表示される（access token が使われている）
