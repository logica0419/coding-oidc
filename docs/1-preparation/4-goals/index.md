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

| フェーズ | 内容                          | リンク                                                                  |
| -------- | ----------------------------- | ----------------------------------------------------------------------- |
| Phase 1  | OAuth 認可コードフロー        | <https://github.com/logica0419/coding-oidc/tree/main/reference/phase-1> |
| Phase 2  | state による CSRF 対策        | <https://github.com/logica0419/coding-oidc/tree/main/reference/phase-2> |
| Phase 3  | PKCE によるコード乗っ取り対策 | <https://github.com/logica0419/coding-oidc/tree/main/reference/phase-3> |
| Phase 4  | OIDC (ID Token の発行・検証)  | <https://github.com/logica0419/coding-oidc/tree/main/reference/phase-4> |

::: info 注意
参考実装は「答え」です。まずは自分で考えて実装し、どうしても分からないときだけ見るようにしましょう。
:::
