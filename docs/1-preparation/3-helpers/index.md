# 1-3. 使える関数・定数の紹介

ハンズオンで使えるヘルパー関数・定数を紹介します。  
基本的にはこれらの関数を組み合わせることで実装が行えるようになっています。

## 両方 (OP / RP) で使える関数

### クライアント (app/) で使える関数

| 関数                                      | 役割                                               | 引数                                                            | 返り値              |
| ----------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------- | ------------------- |
| `getRequest<Response>(url, headers?)`     | GET リクエストを送る                               | `url: string`, `headers?: Record<string, string>`               | `Promise<Response>` |
| `postRequest<Response>(url, body, form?)` | POST リクエストを送る                              | `url: string`, `body: Record<string, string>`, `form?: boolean` | `Promise<Response>` |
| `pickString(record, name)`                | オブジェクトから文字列を取り出す（なければ空文字） | `record: Record<string, unknown>`, `name: string`               | `string`            |
| `redirectTo(url)`                         | 指定した URL にリダイレクトする                    | `url: string`                                                   | `void`              |
| `randomString(length)`                    | ランダムな文字列を生成する                         | `length: number`                                                | `string`            |
| `createBase64EncodedHash(input)`          | SHA-256 ハッシュを base64url エンコードする        | `input: string`                                                 | `string`            |

### サーバー (server/) で使える関数

| 関数                        | 役割                                     | 引数                               | 返り値              |
| --------------------------- | ---------------------------------------- | ---------------------------------- | ------------------- |
| `handleError(event, error)` | エラーを 400 + `{error: ...}` 形式で返す | `event: H3Event`, `error: unknown` | `{ error: string }` |

## OP 専用の関数

### サーバー (server/) で使える関数

| 関数                               | 役割                         | 引数                                                   | 返り値                       |
| ---------------------------------- | ---------------------------- | ------------------------------------------------------ | ---------------------------- |
| `getAuthCode(code)`                | 認可コードの情報を取得する   | `code: string`                                         | `Promise<AuthCodePayload>`   |
| `setAuthCode(code, payload)`       | 認可コードの情報を保存する   | `code: string`, `payload: AuthCodePayload`             | `Promise<void>`              |
| `deleteAuthCode(code)`             | 認可コードの情報を削除する   | `code: string`                                         | `Promise<void>`              |
| `findUser(id)`                     | ユーザーを取得する           | `id: string`                                           | `Promise<StoredUser>`        |
| `listUsers()`                      | ユーザー一覧を取得する       | —                                                      | `Promise<StoredUser[]>`      |
| `createAccessToken(claims)`        | access token を発行する      | `claims: AccessTokenClaims`                            | `Promise<string>`            |
| `verifyAccessToken(token)`         | access token を検証する      | `token: string`                                        | `Promise<AccessTokenClaims>` |
| `createIdToken(claims)`            | ID Token を発行する          | `claims: IdTokenClaims`                                | `Promise<string>`            |
| `verifyIdToken(token, publicJwk?)` | ID Token を検証する          | `token: string`, `publicJwk?: Record<string, unknown>` | `Promise<IdTokenClaims>`     |
| `getJWTPublicKey()`                | JWKS 形式の公開鍵を取得する  | —                                                      | `Promise<JwksDocument>`      |
| `ACCESS_TOKEN_TTL_SEC`             | access token の有効期限 (秒) | —                                                      | `number`                     |

## RP 専用の関数

### サーバー (server/) で使える関数

| 関数                             | 役割                                          | 引数                                            | 返り値                        |
| -------------------------------- | --------------------------------------------- | ----------------------------------------------- | ----------------------------- |
| `setUserSession(event, payload)` | セッションを保存する (cookie + Redis)         | `event: H3Event`, `payload: SessionPayload`     | `Promise<void>`               |
| `getUserSession(event)`          | セッションを取得する                          | `event: H3Event`                                | `Promise<SessionPayload>`     |
| `setAuthRequest(event, payload)` | 認可リクエスト情報を保存する (cookie + Redis) | `event: H3Event`, `payload: AuthRequestPayload` | `Promise<void>`               |
| `getAuthRequest(event)`          | 認可リクエスト情報を取得する                  | `event: H3Event`                                | `Promise<AuthRequestPayload>` |
| `deleteAuthRequest(event)`       | 認可リクエスト情報を削除する                  | `event: H3Event`                                | `Promise<void>`               |

## レスポンス型

| 型                         | フィールド                                                                                |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| `TokenResponse`            | `access_token: string`, `token_type: "Bearer"`, `expires_in: number`, `id_token?: string` |
| `ConsentResponse`          | `redirectTo: string`                                                                      |
| `AuthorizationUrlResponse` | `authorizeUrl: string`                                                                    |
| `ExchangeResponse`         | `message: string`                                                                         |
| `MeResponse`               | `sub: string`, `name: string`                                                             |
| `ExampleResponse`          | `message: string`                                                                         |
| `UsersResponse`            | `{ id: string; name: string }[]`                                                          |
