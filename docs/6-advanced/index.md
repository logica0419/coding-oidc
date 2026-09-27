# 6. 発展課題

ここからはきちんとプロジェクトの中身を理解して、Nuxt ができないといけません。参考実装は用意しないので、それぞれのアイデアを提示するだけにします。

## op 側にもログイン画面を実装

- ログイン画面・パスワードの保存を実装
- ログイン後に authorization endpoint に戻ってくるようにする

現在は認可ページでユーザーを選択するだけですが、実際の OP ではユーザー名とパスワードでログインします。

## user の複数化

- 複数の user を登録できるようにする

現在は `user1` / `user2` の固定 2 ユーザーです。ユーザー登録 API や管理画面を実装すると、より実践的になります。

## client の複数化

- 複数の client を登録できるようにする
- 別アプリがないとあまり意味を成さないため、難易度は高い

現在は `rp-demo` の固定 1 クライアントです。複数クライアントを登録できるようにすると、client_id の検証が意味を持ちます。

## その他安全対策

### redirect_uri の検証

現在は redirect_uri を実装していません（単一登録時は仕様上任意のため）。複数クライアントを登録する場合は、redirect_uri の検証が必要になります。

- クライアントごとに登録された redirect_uri と、リクエストの redirect_uri を照合する
- 一致しない場合はエラーにする（open redirect 対策）

### nonce の実装

code flow では任意ですが、リプレイ攻撃対策として nonce を実装することもできます。

- RP で nonce を生成して authorization URL に付ける
- OP が ID Token に nonce claim を含める
- RP が ID Token の nonce を検証する

### OIDC Discovery Endpoint

`.well-known/openid-configuration` を実装すると、OP の設定を動的に取得できます。

- issuer / authorization_endpoint / token_endpoint / jwks_uri などを公開する
- RP 側でハードコーディングせずに、Discovery Endpoint から取得する
