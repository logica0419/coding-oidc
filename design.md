# 設計

## アプリ構成

- 共通
- pageは、スペーシング以外できるだけCSSを含めない。buttonとかはグローバルCSSでなんとかする
- pageもapiも、上に実装対象の関数を固め、
  - 実装対象の関数は、上にまとめて書く。その下に、その関数を利用して、実際に処理できるようにしたラッパーを置く
  - 実装対象の関数は、コメントで「TODO： 〜〜〜」と書く
  - 実装対象の関数は、引数と返り値の型を明示する。
  - 実装対象の関数は、引数と返り値の型を明示するために、必要に応じて型定義を作る

### op

- API
  - token endpoint 実装対象
  - jwks endpoint 実装対象
  - authorization api (認可ページからリクエストを受け、codeを発行する) 実装対象
    - 認可ページ (GET /authorize) が authorization endpoint の役割を果たし、POST /consent はそのサーバー側ヘルパーとして存在する
  - other apis (認可を体験させるため)
    - ここら辺は、同オリジン or アクセストークンがあればアクセスできるようにする (middlewareで制御)
    - GET /api/example "access granted!"と返すだけの簡単なAPI
    - GET /api/users ユーザー一覧を返すAPI
- 画面
  - index
    - 上から
      - ユーザー一覧
      - /api/example へのアクセスボタン (常に成功するはず)
  - authorization (authorization endpoint)
    - 上から
      - 「OAuth/OIDC 認可ページ」
      - ユーザー一覧 (選択させる、ログインの代わり)
      - 「許可する」ボタン (押すと code を発行して RP にリダイレクトする) ボタン本体はある、中の処理は実装対象

## rp

- API
  - get /authorization-url (authorization urlを作る) 実装対象
  - post /exchange (codeを受け取ってtoken endpointにリクエストする) 実装対象
  - get /me (セッションからユーザー情報を返す) 実装対象
  - get /example (セッションのアクセストークンでOPの/api/exampleにアクセスする)
- セッション
  - cookieにはIDのみ保存し、実データはRedisに保存する
  - state / codeVerifier も同様に、cookieのID + Redisで保持する
- 画面
  - index
    - 上から
      - 現在のユーザーを表示 (get /me で取得する)
      - 「/api/example にアクセスする」ボタン (押すと /api/example にアクセスする)
      - 「opを使ってログインする」ボタン (押すと authorization endpoint にリダイレクトする) 中の処理は実装対象
  - callback
    - 上から
      - 「OAuth/OIDC コールバックページ」
      - 「コードをトークンに交換する」ボタン (押すと token endpoint にリクエストする) 中の処理(post codeへのリクエストだけ)は実装対象
        - 変換できたら「交換できました！」と表示
      - 「ホームに戻る」ボタン (押すと index にリダイレクトする)

## 実装のフェーズ (referenceを切るフェーズ)

### Phase 0: initial state (template内がこの状態になる)

- 「実装対象」と書いた以外の機能が全て実装され、動く

### Phase 1: OAuth

- RPのindexから、authorization endpointにリダイレクトして、codeを受け取るまでを実装する
- RPのcallbackで、codeを受け取って、token endpointにリクエストして、access tokenを受け取るまでを実装する
- [実験] indexから「/api/example にアクセスする」ボタンを押すと、access tokenを使って /api/example にアクセスできることを確認する

### Phase 2: state

- [実験] CSRFが起きることを確かめるために、シークレットウィンドウからのトークン取得を試す: 擬似的な攻撃テスト
- Phase 1の実装に加えて、stateを使ったCSRF対策を実装する
- [実験] CSRFが起きないことを確認する

### Phase 3: PKCE

- [実験] stateがあっても、コード乗っ取り攻撃が有効なことを確かめる: 擬似的な攻撃テスト
- Phase 2の実装に加えて、PKCEを使った認可コードフローを実装する
- [実験] コード乗っ取り攻撃が起きないことを確認する

### Phase 4: OIDC

- Phase 3の実装に加えて、scopeにopenidを追加して、ID Tokenを取得する
- /me APIを実装して、セッションからユーザー情報を返す
- [実験] ID Tokenを検証して、ユーザー情報を取得できることを確認する

### 発展課題

ここからはきちんとプロジェクトの中身を理解して、nuxtができないといけない
referenceには含めない、Docsでアイデアとして示しておく

- op側にもログイン画面を実装
  - ログイン画面・パスワードの保存を実装
  - ログイン後にauthorization endpointに戻ってくるようにする
- userの複数化
  - 複数のuserを登録できるようにする
- clientの複数化
  - 複数のclientを登録できるようにする
  - 別アプリがないとあまり意味を成さないため、難易度は高い
- その他安全対策
  - redirect_uriの検証

## 要件

- code flow
- opのユーザー一覧は、`[{id: "user1", name: "ユーザー1"}, {id: "user2", name: "ユーザー2"}]` のような形で固定。emailは入れない
  - DBに、起動時に初期値を入れるようにする
- authorization endpointは、request_type、client_id、scopeと安全対策系のパラメーターしか実装しない
  - scopeは、openidとexample (api/exampleを叩ける権限) の2つで固定。未知のscopeは拒否する
  - client_idは、固定値で良い
- token endpointは、grant_type、codeと安全対策系のパラメーターしか実装しない
- PKCEは必須 (code_challenge必須、S256のみ許可)
- ID Tokenは、scopeにopenidが含まれる場合のみ返す
- エラーレスポンスはRFC 6749準拠の `{error: "..."}` 形式 + 400で返す
- 認可エンドポイントのエラーは、ページ内で表示する (リダイレクトしない)
- redirect_uriは実装しない (単一登録時は仕様上任意のため)
- nonceは実装しない (code flowでは任意のため)
- 基本的にOAuth / OIDCは、仕様上許される最低限のものしか実装しない方針
- 共有ライブラリは、発展課題もやりやすいように作っておく
- Phaseごとに差分がまとめやすいようなコードを書く
- 実装対象の関数は、その上に関係するフェーズもコメントで書いておく
  - 例

  ```ts
  // TODO: Phase 1: OAuth
  // TODO: Phase 2: state
  const getAuthorizationUrl = (
    clientId: string,
    redirectUri: string,
    scope: string[],
    state: string,
  ): string => {};
  ```

## Docsについて

Docsの章立てとそれぞれに書く内容は以下
基本的には、同じくvitepressを使っている <https://github.com/logica0419/coding-container-runtime/tree/main/docs> をリファレンスとする

- index: まだ未定
  - <https://www.security-camp.or.jp/minicamp/yamanashi2026.html> のOIDC講義の内容をそのまま転記かも
- 1章: 準備
  - 座学編資料 (speakerDeckにこれから作る)
  - ハンズオン準備
    - VS Code + Dockerのインストール (これは、別の講座で皆さん入っているので、その確認程度)
    - ZIPファイル (templatesをZIPにして配布します) の展開
    - VS CodeでZIPを展開したディレクトリを開く
    - Dev Containers拡張機能のインストール
    - Dev Containerで開く
  - 進め方
    - フォルダ構造の紹介
      - nuxtを使っていることを紹介
    - 使えるコマンドの紹介
      - bun run dev
      - bun run check
      - bun run lint
      - bun run format
    - 動作確認
      - bun run devで、OPとRPを同時に起動して、<http://localhost:3100> と <http://localhost:3101> にアクセスして、画面が表示されることを確認する
    - 今回編集するファイルの紹介
  - 使える関数・定数の紹介
    - OP / RP / 両方とServer / Clientのマトリックスで紹介
      - 関数名
      - どんな役割なのか
      - 引数・返り値の型
- 2章: Phase 1: OAuth
- 3章: Phase 2: state
- 4章: Phase 3: PKCE
- 5章: Phase 4: OIDC
- 6章: 発展課題
  - ここからは、参考実装は用意しない
  - それぞれのアイデアを提示するだけにする

### 各Phaseの章の内容

- 実装する仕様の整理
- 今の状態確認
- 実装
  - それぞれのPhaseを、適切な粒度で節に分ける
    - 基本的には変種するファイル単位で分けるが、初心者にとってわかりやすい区分けであることを優先
  - 節ごとに、どのファイルのどの関数を編集するかきちんと示す
  - 節ごとに、どんな仕様を実装するのか、どんな処理を実装するのかをきちんと示す
    - 処理を言葉で示す
    - SVG / marmaid (vitepressが対応していれば) で図解もしたい
  - ヒントとして、どの処理はどの関数をどんな引数で呼ぶべきかを示す
    - <https://github.com/logica0419/coding-container-runtime/tree/main/docs> と同様
  - 最後に、参考実装を隠した状態で示す
    - <https://github.com/logica0419/coding-container-runtime/tree/main/docs> と同様、detailsとして隠して、実装する差分を示す
- 実装後の状態確認

## これからの進め方

- ひとまず、templateに対してPhase 4まで実装
  - 私が実装を確認します
- その後、reference/phase-4に、実装をコピー
  - コードの参考にしてもらうだけなので、devcontainerとかはコピーしない
- その後、実装を「戻していく」ような形でPhase 0までの実装を作る
  - Phase 0の状態に戻すと、templateの状態と同じになる
  - これと同時に、Docsも更新する
    - Docsの章立てとそれぞれに書く内容は、上の「## Docsについて」に書いた通り
- Phaseを戻すごとに、reference/phase-3, reference/phase-2, ... phase-1とディレクトリを作っていく
  - 戻すごとに挙動も確認する
