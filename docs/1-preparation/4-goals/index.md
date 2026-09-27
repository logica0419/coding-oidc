# 1-4. 目標

このハンズオンで達成する目標を確認します。

## 今回の目標

このハンズオンでは、OAuth と OIDC の 2 つの仕組みを実装します。

### OAuth: OP の API を RP からアクセスできるようにする

OpenID Provider (OP) の「`/api/example`」が、Relying Party (RP) からアクセスできるようにします。

つまり、**OP が RP に、`/api/example` へのアクセスを認可する**、という流れを実装します。

### OIDC: OP のユーザーとして RP にログインできるようにする

Relying Party (RP) に、OpenID Provider (OP) のユーザーとしてログインできるようにします。

つまり、**OP が RP に、ユーザーが誰であるかを伝える**、という流れを実装します。

## 参考実装

各フェーズの完成形が、リポジトリの `reference/` ディレクトリに置いてあります。  
詰まったときや、完成形を確認したいときに参考にしてください。

| フェーズ | 内容                                   | リンク                                                                                     |
| -------- | -------------------------------------- | ------------------------------------------------------------------------------------------ |
| Phase 1  | OAuth 認可コードフロー                 | <https://github.com/logica0419/coding-oidc/tree/main/reference/phase-1>                    |
| Phase 2  | state による CSRF 対策                 | <https://github.com/logica0419/coding-oidc/tree/main/reference/phase-2>                    |
| Phase 3  | PKCE によるコード乗っ取り対策          | <https://github.com/logica0419/coding-oidc/tree/main/reference/phase-3>                    |
| Phase 4  | OIDC (ID Token の発行・検証)           | <https://github.com/logica0419/coding-oidc/tree/main/reference/phase-4>                    |

::: info 注意
参考実装は「答え」です。まずは自分で考えて実装し、どうしても分からないときだけ見るようにしましょう。
:::

## 目標に際して大事なこと

### OAuth と OIDC の違い

- **OAuth** は「**認可**」の仕組みです。ユーザーに代わって、リソースへのアクセスを許可するためのものです
- **OIDC** は「**認証**」の仕組みです。ユーザーが誰であるかを確認するためのものです

OIDC は OAuth の上に成り立っており、OAuth の仕組みを拡張して認証を実現しています。  
そのため、このハンズオンでも **Phase 1 〜 3 で OAuth を実装し、Phase 4 で OIDC を実装する**、という順番で進めます。

### 認可と認証の違い

- **認可 (Authorization)**: 「何をしてよいか」を決めること
- **認証 (Authentication)**: 「誰であるか」を確認すること

例えば、このハンズオンの目標で言うと、

- OAuth の目標は「RP が `/api/example` にアクセスしてよい」と OP が認可すること
- OIDC の目標は「ログインしたユーザーが誰であるか」を OP が認証して RP に伝えること

となります。混同しやすいので、意識して進めましょう。