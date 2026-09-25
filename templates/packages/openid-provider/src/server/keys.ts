import { generateKeyPair, exportJWK } from "jose";
import { ALGORITHM, KEY_ID } from "@coding-oidc/shared";

interface CachedKeys {
  privateKey: CryptoKey;
  publicJwk: Record<string, unknown>;
}

let cached: CachedKeys | undefined;

// Lazily generate the ES256 key pair once per server process.
export async function getSigningKeys(): Promise<CachedKeys> {
  if (cached === undefined) {
    const { privateKey, publicKey } = await generateKeyPair(ALGORITHM);
    const publicJwk = await exportJWK(publicKey);
    cached = {
      privateKey,
      publicJwk: { ...publicJwk, kid: KEY_ID, alg: ALGORITHM, use: "sig" },
    };
  }
  return cached;
}
