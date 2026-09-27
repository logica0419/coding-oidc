# 3. Phase 2: state

state を使った CSRF 対策を実装します。

## 実装する仕様

- [実験] CSRF が起きることを確かめるために、シークレットウィンドウからのトークン取得を試す: 擬似的な攻撃テスト
- Phase 1 の実装に加えて、state を使った CSRF 対策を実装する
- [実験] CSRF が起きないことを確認する

## 今の状態確認

Phase 1 の実装が完了した状態です。認可コードフローは動きますが、state がありません。

## 目次

- [3-1. authorization URL に state を付ける](./1-authorization-url/)
- [3-2. consent に state を追加する](./2-consent/)
- [3-3. 認可ページから state を送信する](./3-authorize/)
- [3-4. callback で state を検証する](./4-exchange/)

## 実装後の状態確認

1. `bun run dev` で OP と RP を起動する
2. <http://localhost:3100> にアクセスして、ログインフローを一通り実行する
3. 正常にログインできることを確認する
4. [実験] シークレットウィンドウで同じフローを実行すると、state が一致せずエラーになることを確認する（CSRF 対策）
